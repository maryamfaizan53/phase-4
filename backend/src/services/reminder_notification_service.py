"""
Service for handling reminder notifications.
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from sqlmodel import Session
from ..models.task import Task
from ..config.database import get_engine
from .kafka_producer import kafka_producer_service


class ReminderNotificationService:
    """
    Service for managing reminder notifications.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.engine = get_engine()

    async def schedule_reminder(self, task_data: Dict[str, Any]) -> None:
        """
        Schedule a reminder for a task based on its due date.

        Args:
            task_data: The task data that may contain a due date
        """
        try:
            task_id = task_data.get('id')
            due_date_str = task_data.get('due_date')
            title = task_data.get('title', 'Untitled Task')
            user_id = task_data.get('user_id')

            if not due_date_str:
                self.logger.info(f"No due date for task {task_id}, skipping reminder scheduling")
                return

            # Parse the due date
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))

            # Calculate when to send the reminder (e.g., 1 hour before due date)
            reminder_time = due_date - timedelta(hours=1)

            # In a real implementation, we'd schedule this reminder for the specific time
            # For now, we'll just publish an event to Kafka to be processed by a scheduled service

            # Create reminder event
            reminder_event = {
                "task_id": task_id,
                "title": title,
                "due_at": due_date_str,
                "remind_at": reminder_time.isoformat(),
                "user_id": user_id
            }

            # Publish to Kafka via Dapr pubsub
            await kafka_producer_service.publish_event(
                topic="reminders",
                event_data=reminder_event,
                key=f"reminder-{user_id}-{task_id}"
            )

            self.logger.info(f"Scheduled reminder for task {task_id} at {reminder_time.isoformat()}")

        except Exception as e:
            self.logger.error(f"Error scheduling reminder: {str(e)}")
            raise

    async def process_reminder_request(self, reminder_data: Dict[str, Any]) -> None:
        """
        Process a reminder request and send notification.

        Args:
            reminder_data: The reminder data to process
        """
        try:
            task_id = reminder_data.get('task_id')
            title = reminder_data.get('title')
            due_at = reminder_data.get('due_at')
            remind_at = reminder_data.get('remind_at')
            user_id = reminder_data.get('user_id')

            # In a real implementation, this would send an actual notification
            # (email, push notification, SMS, etc.)

            self.logger.info(f"Processing reminder for task {task_id} (title: {title}) for user {user_id}")
            self.logger.info(f"Due at: {due_at}, reminder sent at: {remind_at}")

            # This is where we'd integrate with actual notification services
            # For now, we'll just log the reminder being sent
            await self._send_notification(user_id, task_id, title, due_at)

        except Exception as e:
            self.logger.error(f"Error processing reminder: {str(e)}")
            raise

    async def _send_notification(self, user_id: str, task_id: int, title: str, due_at: str) -> None:
        """
        Send the actual notification to the user.

        Args:
            user_id: The user ID to notify
            task_id: The task ID
            title: The task title
            due_at: When the task is due
        """
        # In a real implementation, this would:
        # - Look up user's notification preferences
        # - Send email, push notification, SMS, etc.
        # - Track delivery status

        self.logger.info(f"Notification sent to user {user_id} for task {task_id}: '{title}' is due at {due_at}")

    async def cancel_scheduled_reminder(self, task_id: int, user_id: str) -> None:
        """
        Cancel a scheduled reminder for a task.

        Args:
            task_id: The task ID
            user_id: The user ID
        """
        # In a real implementation, this would cancel any scheduled reminder
        # by interacting with the scheduler system

        self.logger.info(f"Canceled scheduled reminder for task {task_id} for user {user_id}")


# Global instance
reminder_notification_service = ReminderNotificationService()


async def schedule_task_reminder(task_data: Dict[str, Any]) -> None:
    """
    Schedule a reminder for a task using the service.

    Args:
        task_data: The task data that may contain a due date
    """
    await reminder_notification_service.schedule_reminder(task_data)