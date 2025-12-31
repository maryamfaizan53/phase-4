"""MCP tool: add_task - Create new tasks for users"""
import logging
import json
from pydantic import BaseModel, Field, validator
from sqlmodel import Session
from typing import Optional
from datetime import datetime

from src.models.task import Task

logger = logging.getLogger(__name__)


class AddTaskInput(BaseModel):
    """Input schema for add_task tool"""

    user_id: str = Field(
        ..., min_length=1, max_length=255, description="ID of the user creating the task"
    )
    title: str = Field(
        ..., min_length=1, max_length=200, description="Task title extracted from user input"
    )
    description: Optional[str] = Field(
        None, max_length=2000, description="Optional task description with additional details"
    )
    priority: Optional[str] = Field(
        "medium", description="Task priority: low, medium, high, or urgent"
    )

    @validator("title")
    def title_must_not_be_whitespace(cls, v):
        """Validate title is not empty or whitespace-only"""
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace-only")
        return v.strip()

    @validator("description")
    def strip_description(cls, v):
        """Strip description if provided"""
        if v is not None:
            return v.strip() if v.strip() else None
        return v

    @validator("priority")
    def validate_priority(cls, v):
        """Validate priority is one of the allowed values"""
        if v and v not in ["low", "medium", "high", "urgent"]:
            raise ValueError("Priority must be one of: low, medium, high, urgent")
        return v or "medium"


class AddTaskOutput(BaseModel):
    """Success output schema for add_task tool"""

    success: bool = True
    task: dict
    message: str


class AddTaskError(BaseModel):
    """Error output schema for add_task tool"""

    success: bool = False
    error_code: str
    message: str
    suggestion: Optional[str] = None


def add_task(db: Session, input_data: AddTaskInput) -> dict:
    """
    Create a new task for the user.

    Maps to FR-001, FR-002, FR-003, FR-008, FR-012, FR-014, FR-015.

    Args:
        db: Database session
        input_data: Task creation input (user_id, title, description)

    Returns:
        dict: Success response with task object and confirmation message,
              or error response with error code and suggestion

    Raises:
        ValueError: If validation fails (empty title, too long, etc.)
    """
    # Log tool invocation
    logger.info("Tool: add_task - Input: %s", json.dumps({
        "user_id": input_data.user_id,
        "tool_name": "add_task",
        "timestamp": datetime.utcnow().isoformat(),
        "input": {
            "title": input_data.title,
            "description": input_data.description
        }
    }))

    try:
        # Validate input
        if not input_data.title or not input_data.title.strip():
            return AddTaskError(
                error_code="EMPTY_TITLE",
                message="Task title cannot be empty",
                suggestion="Please provide a task title",
            ).dict()

        if len(input_data.title) > 200:
            return AddTaskError(
                error_code="VALIDATION_ERROR",
                message="Task title must be 200 characters or less",
                suggestion="Please shorten the task title",
            ).dict()

        if input_data.description and len(input_data.description) > 2000:
            return AddTaskError(
                error_code="VALIDATION_ERROR",
                message="Task description must be 2000 characters or less",
                suggestion="Please shorten the description",
            ).dict()

        # Create task
        task = Task(
            user_id=input_data.user_id,
            title=input_data.title.strip(),
            description=input_data.description.strip() if input_data.description else None,
            status="pending",
            priority=input_data.priority or "medium",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        db.add(task)
        db.commit()
        db.refresh(task)

        # Log successful operation
        logger.info("Tool: add_task - Success: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "add_task",
            "timestamp": datetime.utcnow().isoformat(),
            "output": {
                "task_id": task.id,
                "success": True
            }
        }))

        # Return success response
        return AddTaskOutput(
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
            message=f"I've added task #{task.id}: {task.title}",
        ).dict()

    except ValueError as e:
        # Log error
        logger.error("Tool: add_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "add_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return AddTaskError(
            error_code="VALIDATION_ERROR",
            message=str(e),
            suggestion="Please check your input and try again",
        ).dict()
    except Exception as e:
        # Log error
        logger.error("Tool: add_task - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "add_task",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return AddTaskError(
            error_code="INTERNAL_ERROR",
            message="An unexpected error occurred",
            suggestion="Please try again later",
        ).dict()
