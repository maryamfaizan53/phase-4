"""MCP tool: update_task - Modify task title and/or description"""
import logging
import json
from pydantic import BaseModel, Field, model_validator
from sqlmodel import Session, select
from typing import Optional, List, Literal
from datetime import datetime

from src.models.task import Task

logger = logging.getLogger(__name__)


class UpdateTaskInput(BaseModel):
    """Input schema for update_task tool"""

    user_id: str = Field(
        ..., min_length=1, max_length=255, description="ID of the user who owns the task"
    )
    task_id: int = Field(..., ge=1, description="ID of the task to update")
    title: Optional[str] = Field(
        None, min_length=1, max_length=200, description="New task title (optional if description provided)"
    )
    description: Optional[str] = Field(
        None, max_length=2000, description="New task description (optional if title provided, null to clear)"
    )

    @model_validator(mode='after')
    def at_least_one_field(self):
        """Validate at least one field is provided"""
        if self.title is None and self.description is None:
            raise ValueError("At least one field (title or description) must be provided")
        return self


class UpdateTaskOutput(BaseModel):
    """Success output schema for update_task tool"""

    success: bool = True
    task: dict
    updated_fields: List[Literal["title", "description"]]
    message: str


class UpdateTaskError(BaseModel):
    """Error output schema for update_task tool"""

    success: bool = False
    error_code: str
    message: str
    suggestion: Optional[str] = None


def update_task(db: Session, input_data: UpdateTaskInput) -> dict:
    """
    Modify task title and/or description.

    Maps to FR-006, FR-008, FR-010, FR-012, FR-014, FR-015.

    Args:
        db: Database session
        input_data: Task update input (user_id, task_id, title, description)

    Returns:
        dict: Success response with updated task and fields changed,
              or error response

    """
    # Log tool invocation
    logger.info("Tool: update_task - Input: %s", json.dumps({
        "user_id": input_data.user_id,
        "tool_name": "update_task",
        "timestamp": datetime.utcnow().isoformat(),
        "input": {
            "task_id": input_data.task_id,
            "title": input_data.title,
            "description": input_data.description
        }
    }))

    try:
        # Validate at least one field provided
        if input_data.title is None and input_data.description is None:
            return UpdateTaskError(
                error_code="VALIDATION_ERROR",
                message="At least one field must be provided",
                suggestion="Specify what you want to update (title or description)",
            ).dict()

        # Query task with user isolation (FR-015)
        statement = select(Task).where(
            Task.id == input_data.task_id, Task.user_id == input_data.user_id
        )
        task = db.exec(statement).first()

        # Task not found or doesn't belong to user
        if not task:
            return UpdateTaskError(
                error_code="TASK_NOT_FOUND",
                message=f"I couldn't find task #{input_data.task_id}",
                suggestion="Would you like to see your current tasks?",
            ).dict()

        # Validate title if provided
        if input_data.title is not None:
            if not input_data.title.strip():
                return UpdateTaskError(
                    error_code="EMPTY_TITLE",
                    message="Task title cannot be empty",
                    suggestion="Please provide a non-empty title",
                ).dict()

        # Track which fields were updated
        updated_fields = []

        # Update title if provided
        if input_data.title is not None:
            task.title = input_data.title.strip()
            updated_fields.append("title")

        # Update description if provided (including setting to None to clear)
        if "description" in input_data.__fields_set__:
            task.description = (
                input_data.description.strip() if input_data.description else None
            )
            updated_fields.append("description")

        # Update timestamp
        task.updated_at = datetime.utcnow()

        db.add(task)
        db.commit()
        db.refresh(task)

        # Build message
        if len(updated_fields) == 2:
            message = f"I've updated the title and description for task #{task.id}: {task.title}"
        elif "title" in updated_fields:
            message = f"I've updated task #{task.id}: {task.title}"
        else:
            message = f"I've updated the description for task #{task.id}: {task.title}"

        # Log successful operation
        logger.info("Tool: update_task - Success: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "update_task",
            "timestamp": datetime.utcnow().isoformat(),
            "output": {
                "task_id": task.id,
                "success": True
            }
        }))

        # Return success response
        return UpdateTaskOutput(
            success=True,
            task={
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat(),
                "user_id": task.user_id,
            },
            updated_fields=updated_fields,
            message=message,
        ).dict()

    except ValueError as e:
        # Log error
        logger.error("Tool: update_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "update_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return UpdateTaskError(
            error_code="VALIDATION_ERROR",
            message=str(e),
            suggestion="Please check your input and try again",
        ).dict()
    except Exception as e:
        # Log error
        logger.error("Tool: update_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "update_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return UpdateTaskError(
            error_code="INTERNAL_ERROR",
            message="An unexpected error occurred",
            suggestion="Please try again later",
        ).dict()
