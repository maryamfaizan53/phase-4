"""
Processor for handling reminder events from Kafka.
"""
import json
import logging
from typing import Dict, Any
from sqlmodel import Session
from ..config.database import get_engine
from ..services.reminder_notification_service import reminder_notification_service


class ReminderProcessor:
    """
    Processor for handling reminder events from Kafka.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engine = get_engine()

    async def process_reminder_event(self, event_data: Dict[str, Any]) -> None:
        """
        Process a reminder event from Kafka.

        Args:
            event_data: The event data from Kafka
        """
        try:
            event_type = event_data.get('event_type')
            task_id = event_data.get('task_id')
            title = event_data.get('title')
            due_at = event_data.get('due_at')
            remind_at = event_data.get('remind_at')
            user_id = event_data.get('user_id')

            self.logger.info(f"Processing reminder event: {event_type} for task {task_id}, user {user_id}")

            if event_type in ['reminder_scheduled', 'reminders']:
                await self._handle_reminder_processing(task_id, title, due_at, remind_at, user_id)
            else:
                self.logger.warning(f"Unknown reminder event type: {event_type}")

        except Exception as e:
            self.logger.error(f"Error processing reminder event: {str(e)}")
            raise

    async def _handle_reminder_processing(self, task_id: int, title: str, due_at: str, remind_at: str, user_id: str) -> None:
        """
        Handle the processing of a reminder event.

        Args:
            task_id: The task ID
            title: The task title
            due_at: When the task is due
            remind_at: When to send the reminder
            user_id: The user ID
        """
        try:
            # Prepare reminder data
            reminder_data = {
                "task_id": task_id,
                "title": title,
                "due_at": due_at,
                "remind_at": remind_at,
                "user_id": user_id
            }

            # Process the reminder using the notification service
            await reminder_notification_service.process_reminder_request(reminder_data)

            self.logger.info(f"Successfully processed reminder for task {task_id}")

        except Exception as e:
            self.logger.error(f"Error handling reminder processing: {str(e)}")
            raise


# Global instance
reminder_processor = ReminderProcessor()


async def process_reminder_event_from_kafka(event_data: Dict[str, Any]) -> None:
    """
    Process a reminder event from Kafka using the processor.

    Args:
        event_data: The event data from Kafka
    """
    await reminder_processor.process_reminder_event(event_data)