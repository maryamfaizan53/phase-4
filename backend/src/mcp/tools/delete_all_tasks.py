from sqlmodel import Session, select
from src.models.task import Task

def delete_all_tasks(db: Session, user_id: str) -> dict:
    """
    Deletes all tasks for a given user.
    """
    tasks = db.exec(select(Task).where(Task.user_id == user_id)).all()
    if not tasks:
        return {"status": "success", "message": "No tasks to delete."}

    for task in tasks:
        db.delete(task)

    db.commit()
    return {"status": "success", "message": f"Deleted {len(tasks)} tasks."}
