"""MCP tool: list_tasks - Retrieve and filter tasks for users"""
import logging
import json
from pydantic import BaseModel, Field, validator
from sqlmodel import Session, select, func
from typing import Optional, List, Literal
from enum import Enum
from datetime import datetime

from src.models.task import Task

logger = logging.getLogger(__name__)


class TaskStatusFilter(str, Enum):
    """Task status filter options"""

    ALL = "all"
    PENDING = "pending"
    COMPLETED = "completed"


class SortOrder(str, Enum):
    """Sort order options"""

    NEWEST_FIRST = "newest_first"
    OLDEST_FIRST = "oldest_first"


class ListTasksInput(BaseModel):
    """Input schema for list_tasks tool"""

    user_id: str = Field(
        ..., min_length=1, max_length=255, description="ID of the user whose tasks to retrieve"
    )
    status: TaskStatusFilter = Field(
        TaskStatusFilter.ALL, description="Filter tasks by status"
    )
    search: Optional[str] = Field(
        None, description="Search term for filtering tasks by title or description"
    )
    limit: int = Field(20, ge=1, le=100, description="Maximum number of tasks to return")
    offset: int = Field(0, ge=0, description="Number of tasks to skip (for pagination)")
    sort_order: SortOrder = Field(
        SortOrder.NEWEST_FIRST, description="Sort order for tasks"
    )


class ListTasksOutput(BaseModel):
    """Success output schema for list_tasks tool"""

    success: bool = True
    tasks: List[dict]
    total_count: int
    returned_count: int
    has_more: bool
    next_offset: Optional[int]
    message: str


class ListTasksError(BaseModel):
    """Error output schema for list_tasks tool"""

    success: bool = False
    error_code: str
    message: str
    suggestion: Optional[str] = None


def list_tasks(db: Session, input_data: ListTasksInput) -> dict:
    """
    Retrieve tasks for the user with optional filtering.

    Maps to FR-004, FR-010, FR-013, FR-015.

    Args:
        db: Database session
        input_data: Task retrieval input (user_id, status, limit, offset, sort_order)

    Returns:
        dict: Success response with tasks array and pagination metadata,
              or error response

    """
    # Log tool invocation
    logger.info("Tool: list_tasks - Input: %s", json.dumps({
        "user_id": input_data.user_id,
        "tool_name": "list_tasks",
        "timestamp": datetime.utcnow().isoformat(),
        "input": {
            "status": input_data.status.value,
            "search": input_data.search,
            "limit": input_data.limit,
            "offset": input_data.offset,
            "sort_order": input_data.sort_order.value
        }
    }))

    try:
        # Build base query with user isolation (FR-015)
        query = select(Task).where(Task.user_id == input_data.user_id)

        # Apply status filter
        if input_data.status != TaskStatusFilter.ALL:
            query = query.where(Task.status == input_data.status.value)

        # Apply search filter (case-insensitive search in title and description)
        if input_data.search:
            search_term = f"%{input_data.search}%"
            query = query.where(
                (Task.title.ilike(search_term)) | (Task.description.ilike(search_term))
            )

        # Apply sort order
        if input_data.sort_order == SortOrder.NEWEST_FIRST:
            query = query.order_by(Task.created_at.desc())
        else:
            query = query.order_by(Task.created_at.asc())

        # Get total count (for pagination metadata)
        count_query = select(func.count()).select_from(Task).where(Task.user_id == input_data.user_id)
        if input_data.status != TaskStatusFilter.ALL:
            count_query = count_query.where(Task.status == input_data.status.value)
        if input_data.search:
            search_term = f"%{input_data.search}%"
            count_query = count_query.where(
                (Task.title.ilike(search_term)) | (Task.description.ilike(search_term))
            )
        total_count = db.exec(count_query).one()

        # Apply pagination
        query = query.limit(input_data.limit).offset(input_data.offset)

        # Execute query
        tasks = db.exec(query).all()

        # Calculate pagination metadata
        returned_count = len(tasks)
        has_more = (input_data.offset + returned_count) < total_count
        next_offset = (input_data.offset + returned_count) if has_more else None

        # Convert tasks to dict
        tasks_dict = [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "created_at": task.created_at.isoformat(),
                "updated_at": task.updated_at.isoformat(),
                "user_id": task.user_id,
            }
            for task in tasks
        ]

        # Generate message
        if total_count == 0:
            message = "You don't have any tasks yet. Would you like to add one?"
        elif input_data.status == TaskStatusFilter.PENDING:
            message = f"You have {total_count} pending task{'s' if total_count != 1 else ''}"
        elif input_data.status == TaskStatusFilter.COMPLETED:
            message = f"You have {total_count} completed task{'s' if total_count != 1 else ''}"
        else:
            message = f"You have {total_count} task{'s' if total_count != 1 else ''} total"

        # Add pagination hint if applicable
        if has_more:
            remaining = total_count - (input_data.offset + returned_count)
            message += f" (showing {returned_count}, {remaining} more available)"

        # Log successful operation
        logger.info("Tool: list_tasks - Success: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "list_tasks",
            "timestamp": datetime.utcnow().isoformat(),
            "output": {
                "total_count": total_count,
                "returned_count": returned_count,
                "success": True
            }
        }))

        return ListTasksOutput(
            success=True,
            tasks=tasks_dict,
            total_count=total_count,
            returned_count=returned_count,
            has_more=has_more,
            next_offset=next_offset,
            message=message,
        ).dict()

    except Exception as e:
        # Log error
        logger.error("Tool: list_tasks - Error: %s", json.dumps({
            "user_id": input_data.user_id,
            "tool_name": "list_tasks",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }))
        return ListTasksError(
            error_code="INTERNAL_ERROR",
            message="An unexpected error occurred while retrieving tasks",
            suggestion="Please try again later",
        ).dict()
