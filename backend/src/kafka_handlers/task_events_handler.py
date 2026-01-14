"""
Handler for processing task-related events from Kafka.
"""
import json
import logging
from typing import Dict, Any, Optional
from sqlmodel import Session
from ..models.task import Task
from ..services.kafka_consumer import kafka_consumer_service
from ..config.database import get_engine


class TaskEventsHandler:
    """
    Handler for processing task-related events from Kafka.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engine = get_engine()

    async def handle_task_event(self, event_data: Dict[str, Any]) -> None:
        """
        Handle a task event from Kafka.

        Args:
            event_data: The event data from Kafka
        """
        try:
            event_type = event_data.get('event_type')
            task_id = event_data.get('task_id')
            task_data = event_data.get('task_data')
            user_id = event_data.get('user_id')
            timestamp = event_data.get('timestamp')

            self.logger.info(f"Processing task event: {event_type} for task {task_id} by user {user_id}")

            # Process based on event type
            if event_type == 'created':
                await self._handle_task_created(task_data, user_id)
            elif event_type == 'updated':
                await self._handle_task_updated(task_data, user_id)
            elif event_type == 'completed':
                await self._handle_task_completed(task_data, user_id)
            elif event_type == 'deleted':
                await self._handle_task_deleted(task_id, user_id)
            else:
                self.logger.warning(f"Unknown event type: {event_type}")

        except Exception as e:
            self.logger.error(f"Error handling task event: {str(e)}")
            raise

    async def _handle_task_created(self, task_data: Dict[str, Any], user_id: str) -> None:
        """
        Handle a task creation event.

        Args:
            task_data: The task data
            user_id: The user ID
        """
        try:
            # Create the task in the database
            with Session(self.engine) as session:
                # Create a new Task instance
                task = Task(
                    title=task_data.get('title'),
                    description=task_data.get('description'),
                    completed=task_data.get('completed', False),
                    user_id=user_id  # Assuming user_id is part of task_data or passed separately
                )

                # Add to session and commit
                session.add(task)
                session.commit()
                session.refresh(task)

                self.logger.info(f"Task created with ID: {task.id}")

        except Exception as e:
            self.logger.error(f"Error creating task: {str(e)}")
            raise

    async def _handle_task_updated(self, task_data: Dict[str, Any], user_id: str) -> None:
        """
        Handle a task update event.

        Args:
            task_data: The task data
            user_id: The user ID
        """
        try:
            task_id = task_data.get('id')
            if not task_id:
                raise ValueError("Task ID is required for update event")

            with Session(self.engine) as session:
                # Query the existing task
                task = session.get(Task, task_id)

                if not task:
                    self.logger.warning(f"Task with ID {task_id} not found for update")
                    return

                # Update the task with new data
                if 'title' in task_data:
                    task.title = task_data['title']
                if 'description' in task_data:
                    task.description = task_data['description']
                if 'completed' in task_data:
                    task.completed = task_data['completed']

                session.add(task)
                session.commit()

                self.logger.info(f"Task updated with ID: {task.id}")

        except Exception as e:
            self.logger.error(f"Error updating task: {str(e)}")
            raise

    async def _handle_task_completed(self, task_data: Dict[str, Any], user_id: str) -> None:
        """
        Handle a task completion event.

        Args:
            task_data: The task data
            user_id: The user ID
        """
        try:
            task_id = task_data.get('id')
            if not task_id:
                raise ValueError("Task ID is required for completion event")

            with Session(self.engine) as session:
                # Query the existing task
                task = session.get(Task, task_id)

                if not task:
                    self.logger.warning(f"Task with ID {task_id} not found for completion")
                    return

                # Mark task as completed
                task.completed = True

                session.add(task)
                session.commit()

                self.logger.info(f"Task marked as completed with ID: {task.id}")

        except Exception as e:
            self.logger.error(f"Error completing task: {str(e)}")
            raise

    async def _handle_task_deleted(self, task_id: int, user_id: str) -> None:
        """
        Handle a task deletion event.

        Args:
            task_id: The task ID
            user_id: The user ID
        """
        try:
            with Session(self.engine) as session:
                # Query the existing task
                task = session.get(Task, task_id)

                if not task:
                    self.logger.warning(f"Task with ID {task_id} not found for deletion")
                    return

                # Delete the task
                session.delete(task)
                session.commit()

                self.logger.info(f"Task deleted with ID: {task.id}")

        except Exception as e:
            self.logger.error(f"Error deleting task: {str(e)}")
            raise


# Global instance
task_events_handler = TaskEventsHandler()


async def process_task_event(event_data: Dict[str, Any]) -> None:
    """
    Process a task event using the handler.

    Args:
        event_data: The event data from Kafka
    """
    await task_events_handler.handle_task_event(event_data)