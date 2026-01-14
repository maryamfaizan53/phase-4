"""
Service for handling recurring tasks.
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from sqlmodel import Session
from ..models.task import Task
from ..config.database import get_engine
from .kafka_producer import kafka_producer_service


class RecurringTaskService:
    """
    Service for managing recurring tasks.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engine = get_engine()

    async def process_recurring_task_completion(self, task_data: Dict[str, Any]) -> None:
        """
    Process a completed recurring task and create the next occurrence.

    Args:
        task_data: The completed task data
    """
        try:
            # Check if this task is recurring
            is_recurring = task_data.get('is_recurring', False)
            recurrence_pattern = task_data.get('recurrence_pattern')  # e.g., 'daily', 'weekly', 'monthly'

            if not is_recurring or not recurrence_pattern:
                self.logger.info(f"Task {task_data.get('id')} is not recurring, skipping recurrence processing")
                return

            # Create the next occurrence based on the pattern
            next_task_data = await self._create_next_occurrence(task_data)

            if next_task_data:
                # Publish an event to create the next task
                event_payload = {
                    "event_type": "recurring_task_created",
                    "original_task_id": task_data.get('id'),
                    "new_task_data": next_task_data,
                    "user_id": task_data.get('user_id'),
                    "timestamp": datetime.utcnow().isoformat()
                }

                # Publish to Kafka via Dapr pubsub
                await kafka_producer_service.publish_event(
                    topic="task-events",
                    event_data=event_payload,
                    key=f"recurring-{task_data.get('user_id')}-{task_data.get('id')}"
                )

                self.logger.info(f"Published recurring task event for next occurrence of task {task_data.get('id')}")

        except Exception as e:
            self.logger.error(f"Error processing recurring task completion: {str(e)}")
            raise

    async def _create_next_occurrence(self, completed_task: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create the next occurrence of a recurring task based on its pattern.

        Args:
            completed_task: The completed task data

        Returns:
            The data for the next occurrence or None if pattern is invalid
        """
        try:
            recurrence_pattern = completed_task.get('recurrence_pattern', '').lower()
            current_due_date_str = completed_task.get('due_date')

            # Parse current due date
            if current_due_date_str:
                current_due_date = datetime.fromisoformat(current_due_date_str.replace('Z', '+00:00'))
            else:
                current_due_date = datetime.utcnow()

            # Calculate next due date based on pattern
            if recurrence_pattern == 'daily':
                next_due_date = current_due_date + timedelta(days=1)
            elif recurrence_pattern == 'weekly':
                next_due_date = current_due_date + timedelta(weeks=1)
            elif recurrence_pattern == 'monthly':
                # Simple monthly calculation (same day next month)
                if current_due_date.month == 12:
                    next_due_date = current_due_date.replace(year=current_due_date.year + 1, month=1)
                else:
                    next_due_date = current_due_date.replace(month=current_due_date.month + 1)
            elif recurrence_pattern == 'yearly':
                next_due_date = current_due_date.replace(year=current_due_date.year + 1)
            else:
                self.logger.warning(f"Invalid recurrence pattern: {recurrence_pattern}")
                return None

            # Create next task data
            next_task_data = {
                'title': completed_task.get('title'),
                'description': completed_task.get('description'),
                'user_id': completed_task.get('user_id'),
                'due_date': next_due_date.isoformat(),
                'completed': False,
                'is_recurring': True,  # Maintain the recurring property
                'recurrence_pattern': recurrence_pattern,
                'parent_task_id': completed_task.get('id'),  # Track the parent task
            }

            self.logger.info(f"Created next occurrence for recurring task {completed_task.get('id')}: "
                            f"due {next_due_date.isoformat()}")

            return next_task_data

        except Exception as e:
            self.logger.error(f"Error creating next occurrence: {str(e)}")
            return None

    async def schedule_recurring_task_creation(self, task_data: Dict[str, Any]) -> None:
        """
        Schedule the creation of a recurring task based on its start date.

        Args:
            task_data: The recurring task data
        """
        try:
            is_recurring = task_data.get('is_recurring', False)
            start_date_str = task_data.get('start_date') or task_data.get('due_date')

            if not is_recurring or not start_date_str:
                self.logger.info(f"Task {task_data.get('id')} is not recurring or has no start date, skipping scheduling")
                return

            # In a real implementation, we'd schedule this task to be created at the start date
            # This could involve scheduling a job or publishing a delayed event
            self.logger.info(f"Scheduled recurring task {task_data.get('id')} to start at {start_date_str}")

            # For now, we'll just log the scheduling
            # In a real system, this would integrate with a scheduler like Celery, APScheduler, etc.

        except Exception as e:
            self.logger.error(f"Error scheduling recurring task creation: {str(e)}")
            raise


# Global instance
recurring_task_service = RecurringTaskService()


async def process_recurring_task_completion(task_data: Dict[str, Any]) -> None:
    """
    Process a completed recurring task using the service.

    Args:
        task_data: The completed task data
    """
    await recurring_task_service.process_recurring_task_completion(task_data)