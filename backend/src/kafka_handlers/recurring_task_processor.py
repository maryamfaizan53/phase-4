"""
Processor for handling recurring task events from Kafka.
"""
import json
import logging
from typing import Dict, Any
from sqlmodel import Session
from ..models.task import Task
from ..config.database import get_engine
from ..services.recurring_task_service import recurring_task_service


class RecurringTaskProcessor:
    """
    Processor for handling recurring task events from Kafka.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engine = get_engine()

    async def process_recurring_task_event(self, event_data: Dict[str, Any]) -> None:
        """
        Process a recurring task event from Kafka.

        Args:
            event_data: The event data from Kafka
        """
        try:
            event_type = event_data.get('event_type')
            original_task_id = event_data.get('original_task_id')
            new_task_data = event_data.get('new_task_data')
            user_id = event_data.get('user_id')

            self.logger.info(f"Processing recurring task event: {event_type} for original task {original_task_id}")

            if event_type == 'recurring_task_created':
                await self._handle_recurring_task_creation(new_task_data, user_id)
            else:
                self.logger.warning(f"Unknown recurring task event type: {event_type}")

        except Exception as e:
            self.logger.error(f"Error processing recurring task event: {str(e)}")
            raise

    async def _handle_recurring_task_creation(self, task_data: Dict[str, Any], user_id: str) -> None:
        """
        Handle the creation of a new recurring task occurrence.

        Args:
            task_data: The task data for the new occurrence
            user_id: The user ID
        """
        try:
            with Session(self.engine) as session:
                # Create a new Task instance for the next occurrence
                new_task = Task(
                    title=task_data.get('title'),
                    description=task_data.get('description'),
                    completed=task_data.get('completed', False),
                    user_id=user_id,
                    due_date=task_data.get('due_date'),
                    is_recurring=task_data.get('is_recurring', False),
                    recurrence_pattern=task_data.get('recurrence_pattern'),
                    parent_task_id=task_data.get('parent_task_id')  # Link to parent recurring task
                )

                # Add to session and commit
                session.add(new_task)
                session.commit()
                session.refresh(new_task)

                self.logger.info(f"Created new recurring task occurrence with ID: {new_task.id}")

        except Exception as e:
            self.logger.error(f"Error creating recurring task occurrence: {str(e)}")
            raise


# Global instance
recurring_task_processor = RecurringTaskProcessor()


async def process_recurring_task_event_from_kafka(event_data: Dict[str, Any]) -> None:
    """
    Process a recurring task event from Kafka using the processor.

    Args:
        event_data: The event data from Kafka
    """
    await recurring_task_processor.process_recurring_task_event(event_data)