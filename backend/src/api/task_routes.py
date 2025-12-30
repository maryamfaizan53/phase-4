"""REST API routes for task CRUD operations"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from typing import Optional, List

from src.api.dependencies import get_db, get_current_user
from src.mcp.tools.list_tasks import list_tasks, ListTasksInput, TaskStatusFilter, SortOrder
from src.mcp.tools.add_task import add_task, AddTaskInput
from src.mcp.tools.update_task import update_task, UpdateTaskInput
from src.mcp.tools.complete_task import complete_task, CompleteTaskInput
from src.mcp.tools.delete_task import delete_task, DeleteTaskInput
from src.models.task import Task

router = APIRouter(prefix="/api", tags=["tasks"])


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


@router.get("/{user_id}/tasks")
async def list_user_tasks(
    user_id: str,
    completed: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    order: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all tasks for a user with optional filtering.

    Thin wrapper around list_tasks MCP tool.

    Args:
        user_id: User ID from path
        completed: Filter by completion status ("true", "false", or None for all)
        search: Search term for title/description
        sort: Sort field (created_at, updated_at)
        order: Sort order (asc, desc)
        limit: Maximum number of results
        offset: Pagination offset
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        List of tasks

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id does not match authenticated user"
        )

    # Map frontend filter to MCP tool status filter
    status_filter = TaskStatusFilter.ALL
    if completed == "true":
        status_filter = TaskStatusFilter.COMPLETED
    elif completed == "false":
        status_filter = TaskStatusFilter.PENDING

    # Map frontend sort to MCP tool sort order
    sort_order = SortOrder.NEWEST_FIRST
    if sort == "created_at" and order == "asc":
        sort_order = SortOrder.OLDEST_FIRST
    elif sort == "created_at" and order == "desc":
        sort_order = SortOrder.NEWEST_FIRST

    # Call MCP tool
    input_data = ListTasksInput(
        user_id=user_id,
        status=status_filter,
        search=search,
        limit=min(limit, 100),
        offset=offset,
        sort_order=sort_order
    )

    result = list_tasks(db, input_data)

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("error") or "Failed to list tasks"
        )

    return result.get("tasks", [])


@router.get("/{user_id}/tasks/{task_id}")
async def get_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a single task by ID.

    Args:
        user_id: User ID from path
        task_id: Task ID to retrieve
        current_user: Authenticated user from JWT
        db: Database session

    Returns:
        Task data

    Raises:
        HTTPException: 403 if user_id doesn't match authenticated user
        HTTPException: 404 if task not found
    """
    # Verify user authorization
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: user_id does not match authenticated user"
        )

    # Query task from database
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.post("/{user_id}/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new task for a user.

    Thin wrapper around add_task MCP tool.

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

    return result.get("task")


@router.put("/{user_id}/tasks/{task_id}")
async def update_task_endpoint(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update an existing task.

    Thin wrapper around update_task MCP tool.

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
            detail="Forbidden: user_id does not match authenticated user"
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

    return result.get("task")


@router.patch("/{user_id}/tasks/{task_id}/complete")
async def toggle_task_completion(
    user_id: str,
    task_id: int,
    toggle_data: TaskCompleteToggle,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Toggle task completion status.

    Thin wrapper around complete_task MCP tool.

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
            detail="Forbidden: user_id does not match authenticated user"
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

    return result.get("task")


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_endpoint(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a task.

    Thin wrapper around delete_task MCP tool.

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
            detail="Forbidden: user_id does not match authenticated user"
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

    return None
