"""
Enhanced task endpoints with Kafka/Dapr integration for event streaming.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from typing import Optional, List
from datetime import datetime
import logging

from .dependencies import get_db, get_current_user
from ..mcp.tools.list_tasks import list_tasks, ListTasksInput, TaskStatusFilter, SortOrder
from ..mcp.tools.add_task import add_task, AddTaskInput
from ..mcp.tools.update_task import update_task, UpdateTaskInput
from ..mcp.tools.complete_task import complete_task, CompleteTaskInput
from ..mcp.tools.delete_task import delete_task, DeleteTaskInput
from ..models.task import Task
from ..services.dapr_client import dapr_client
from ..services.kafka_producer import kafka_producer_service


router = APIRouter(prefix="/api/v2", tags=["tasks-v2"])

logger = logging.getLogger(__name__)


class TaskCreate(BaseModel):
    """Task creation request"""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)


class TaskUpdate(BaseModel):
    """Task update request"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)


class TaskCompleteToggle(BaseModel):
    """Task completion toggle request"""
    completed: bool


async def publish_task_event(event_type: str, task_data: dict, user_id: str):
    """
    Publish a task event to Kafka via Dapr pubsub.

    Args:
        event_type: Type of event (created, updated, completed, deleted)
        task_data: The task data
        user_id: The user ID
    """
    try:
        event_payload = {
            "event_type": event_type,
            "task_id": task_data.get("id"),
            "task_data": task_data,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }

        # Publish to Kafka via Dapr pubsub
        await dapr_client.publish_event(
            pubsub_name="kafka-pubsub",
            topic_name="task-events",
            data=event_payload
        )

        logger.info(f"Published {event_type} event for task {task_data.get('id')} to Kafka")

    except Exception as e:
        logger.error(f"Failed to publish {event_type} event: {str(e)}")
        # Consider fallback mechanism or error handling strategy


@router.post("/{user_id}/tasks", status_code=status.HTTP_201_CREATED)
async def create_task_with_events(
    user_id: str,
    task_data: TaskCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new task for a user with event publishing to Kafka.

    Args:
        user_id: User ID from path
        task_data: Task creation data
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Created task

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id does not match authenticated user"
        )

    # Call MCP tool
    input_data = AddTaskInput(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description
    )

    result = add_task(db, input_data)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("error") or "Failed to create task"
        )

    created_task = result.get("task")

    # Publish event to Kafka via Dapr
    try:
        await publish_task_event("created", created_task, user_id)
    except Exception as e:
        logger.error(f"Failed to publish task creation event: {str(e)}")
        # Continue with response even if event publishing fails

    return created_task


@router.put("/{user_id}/tasks/{task_id}")
async def update_task_with_events(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing task with event publishing to Kafka.

    Args:
        user_id: User ID from path
        task_id: Task ID to update
        task_data: Task update data
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
        HTTPException: 404 if task not found
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id doesn't match authenticated user"
        )

    # Call MCP tool
    input_data = UpdateTaskInput(
        user_id=user_id,
        task_id=task_id,
        title=task_data.title,
        description=task_data.description
    )

    result = update_task(db, input_data)

    if not result.get("success"):
        error_msg = result.get("error") or ""
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg or "Task not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg or "Failed to update task"
        )

    updated_task = result.get("task")

    # Publish event to Kafka via Dapr
    try:
        await publish_task_event("updated", updated_task, user_id)
    except Exception as e:
        logger.error(f"Failed to publish task update event: {str(e)}")
        # Continue with response even if event publishing fails

    return updated_task


@router.patch("/{user_id}/tasks/{task_id}/complete")
async def toggle_task_completion_with_events(
    user_id: str,
    task_id: int,
    toggle_data: TaskCompleteToggle,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Toggle task completion status with event publishing to Kafka.

    Args:
        user_id: User ID from path
        task_id: Task ID to toggle
        toggle_data: Completion status
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
        HTTPException: 404 if task not found
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id doesn't match authenticated user"
        )

    # Call MCP tool
    input_data = CompleteTaskInput(
        user_id=user_id,
        task_id=task_id,
        completed=toggle_data.completed
    )

    result = complete_task(db, input_data)

    if not result.get("success"):
        error_msg = result.get("error") or ""
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg or "Task not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg or "Failed to toggle task completion"
        )

    updated_task = result.get("task")

    # Publish event to Kafka via Dapr
    event_type = "completed" if toggle_data.completed else "updated"
    try:
        await publish_task_event(event_type, updated_task, user_id)
    except Exception as e:
        logger.error(f"Failed to publish task completion event: {str(e)}")
        # Continue with response even if event publishing fails

    return updated_task


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_with_events(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a task with event publishing to Kafka.

    Args:
        user_id: User ID from path
        task_id: Task ID to delete
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        None (204 No Content)

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
        HTTPException: 404 if task not found
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id doesn't match authenticated user"
        )

    # Get the task before deletion to include in the event
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Call MCP tool
    input_data = DeleteTaskInput(
        user_id=user_id,
        task_id=task_id
    )

    result = delete_task(db, input_data)

    if not result.get("success"):
        error_msg = result.get("error") or ""
        if "not found" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=error_msg or "Task not found"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg or "Failed to delete task"
        )

    # Publish event to Kafka via Dapr
    try:
        task_dict = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "user_id": task.user_id,
            "created_at": task.created_at.isoformat() if task.created_at else None,
            "updated_at": task.updated_at.isoformat() if task.updated_at else None
        }
        await publish_task_event("deleted", task_dict, user_id)
    except Exception as e:
        logger.error(f"Failed to publish task deletion event: {str(e)}")
        # Continue with response even if event publishing fails

    return None