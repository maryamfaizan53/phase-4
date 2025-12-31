"""MCP tool: complete_task - Mark tasks as completed"""
import logging
import json
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from src.models.task import Task

logger = logging.getLogger(__name__)


class CompleteTaskInput(BaseModel):
    """Input schema for complete_task tool"""

    user_id: str = Field(
        ..., min_length=1, max_length=255, description="ID of the user who owns the task"
    )
    task_id: int = Field(..., ge=1, description="ID of the task to mark as complete")
    completed: bool = Field(True, description="Set to True to mark complete, False to mark pending")


class CompleteTaskOutput(BaseModel):
    """Success output schema for complete_task tool"""

    success: bool = True
    task: dict
    message: str
    was_already_completed: bool


class CompleteTaskError(BaseModel):
    """Error output schema for complete_task tool"""

    success: bool = False
    error_code: str
    message: str
    suggestion: Optional[str] = None


def complete_task(db: Session, input_data: CompleteTaskInput) -> dict:
    """
    Mark a task as completed.

    Maps to FR-005, FR-008, FR-010, FR-014, FR-015.

    Implements idempotency: completing already-completed task succeeds with notification.

    Args:
        db: Database session
        input_data: Task completion input (user_id, task_id)

    Returns:
        dict: Success response with updated task and confirmation message,
              or error response

    """
    # Log tool invocation
    logger.info("Tool: complete_task - Input: %s", json.dumps({
        "user_id": input_data.user_id,
        "tool_name": "complete_task",
        "timestamp": datetime.utcnow().isoformat(),
        "input": {
            "task_id": input_data.task_id
        }
    }))

    try:
        # Query task with user isolation (FR-015)
        statement = select(Task).where(
            Task.id == input_data.task_id, Task.user_id == input_data.user_id
        )
        task = db.exec(statement).first()

        # Task not found or doesn't belong to user
        if not task:
            return CompleteTaskError(
                error_code="TASK_NOT_FOUND",
                message=f"I couldn't find task #{input_data.task_id}",
                suggestion="Would you like to see your current tasks?",
            ).dict()

        # Check current status
        was_already_completed = task.status == "completed"
        new_status = "completed" if input_data.completed else "pending"

        # Update if status changed
        if task.status != new_status:
            task.status = new_status
            task.updated_at = datetime.utcnow()
            db.add(task)
            db.commit()
            db.refresh(task)

        # Log successful operation
        logger.info("Tool: complete_task - Success: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "complete_task",
            "timestamp": datetime.utcnow().isoformat(),
            "output": {
                "task_id": task.id,
                "success": True
            }
        }))

        # Build appropriate message
        if input_data.completed:
            if was_already_completed:
                message = f"Task #{task.id} is already completed"
            else:
                message = f"Great! I've marked '{task.title}' (task #{task.id}) as complete"
        else:
            if not was_already_completed:
                message = f"Task #{task.id} is already pending"
            else:
                message = f"I've marked '{task.title}' (task #{task.id}) as pending"

        # Return success response
        return CompleteTaskOutput(
            success=True,
            task={
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat(),
                "user_id": task.user_id,
            },
            message=message,
            was_already_completed=was_already_completed,
        ).dict()

    except Exception as e:
        # Log error
        logger.error("Tool: complete_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "complete_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return CompleteTaskError(
            error_code="INTERNAL_ERROR",
            message="An unexpected error occurred",
            suggestion="Please try again later",
        ).dict()
