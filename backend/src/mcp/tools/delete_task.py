"""MCP tool: delete_task - Remove a task from the user's list"""
import logging
import json
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from src.models.task import Task

logger = logging.getLogger(__name__)


class DeleteTaskInput(BaseModel):
    """Input schema for delete_task tool"""

    user_id: str = Field(
        ..., min_length=1, max_length=255, description="ID of the user who owns the task"
    )
    task_id: int = Field(..., ge=1, description="ID of the task to delete")


class DeleteTaskOutput(BaseModel):
    """Success output schema for delete_task tool"""

    success: bool = True
    task: dict
    message: str


class DeleteTaskError(BaseModel):
    """Error output schema for delete_task tool"""

    success: bool = False
    error_code: str
    message: str
    suggestion: Optional[str] = None


def delete_task(db: Session, input_data: DeleteTaskInput) -> dict:
    """
    Remove a task from the user's list.

    Maps to FR-006, FR-011, FR-015.

    Args:
        db: Database session
        input_data: Task deletion input (user_id, task_id)

    Returns:
        dict: Success response with deleted task details,
              or error response

    """
    # Log tool invocation
    logger.info("Tool: delete_task - Input: %s", json.dumps({
        "user_id": input_data.user_id,
        "tool_name": "delete_task",
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
            return DeleteTaskError(
                error_code="TASK_NOT_FOUND",
                message=f"I couldn't find task #{input_data.task_id}",
                suggestion="Would you like to see your current tasks?",
            ).dict()

        # Store task details for confirmation message
        task_dict = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
            "user_id": task.user_id,
        }

        # Delete the task
        db.delete(task)
        db.commit()

        # Build confirmation message
        message = f"I've deleted task #{task_dict['id']}: {task_dict['title']}"

        # Log successful operation
        logger.info("Tool: delete_task - Success: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "delete_task",
            "timestamp": datetime.utcnow().isoformat(),
            "output": {
                "task_id": task_dict['id'],
                "success": True
            }
        }))

        # Return success response
        return DeleteTaskOutput(
            success=True,
            task=task_dict,
            message=message,
        ).dict()

    except Exception as e:
        # Log error
        logger.error("Tool: delete_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "delete_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return DeleteTaskError(
            error_code="INTERNAL_ERROR",
            message="An unexpected error occurred while deleting the task",
            suggestion="Please try again later",
        ).dict()
