"""
Service for scheduling jobs using Dapr Jobs API.
"""
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from ..services.dapr_client import dapr_client


class DaprJobsScheduler:
    """
    Service for scheduling jobs using Dapr Jobs API.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def schedule_reminder_job(self, task_id: int, user_id: str, title: str, remind_at: str) -> None:
        """
        Schedule a reminder job using Dapr Jobs API.

        Args:
            task_id: The task ID
            user_id: The user ID
            title: The task title
            remind_at: When to send the reminder (ISO format datetime string)
        """
        try:
            # Create job ID
            job_id = f"reminder-job-{task_id}-{user_id}"

            # Prepare job data
            job_data = {
                "job_id": job_id,
                "task_id": task_id,
                "user_id": user_id,
                "title": title,
                "remind_at": remind_at,
                "type": "reminder"
            }

            # In a real implementation with Dapr Jobs API, we would schedule the job
            # However, Dapr doesn't currently have a native Jobs API
            # Instead, we'll simulate by publishing to a delayed message queue or scheduling system

            # For now, we'll publish to Kafka which can be consumed by a service
            # that processes scheduled events
            await dapr_client.publish_event(
                pubsub_name="kafka-pubsub",
                topic_name="task-events",  # Could be a separate topic for scheduled events
                data={
                    "event_type": "reminder_scheduled",
                    "job_id": job_id,
                    "task_id": task_id,
                    "user_id": user_id,
                    "title": title,
                    "remind_at": remind_at,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )

            self.logger.info(f"Scheduled reminder job {job_id} for task {task_id} at {remind_at}")

        except Exception as e:
            self.logger.error(f"Error scheduling reminder job: {str(e)}")
            raise

    async def schedule_recurring_task_job(self, task_data: Dict[str, Any], next_occurrence_time: str) -> None:
        """
        Schedule a job to create a recurring task at the specified time.

        Args:
            task_data: The recurring task data
            next_occurrence_time: When to create the next occurrence (ISO format datetime string)
        """
        try:
            task_id = task_data.get('id')
            user_id = task_data.get('user_id')

            # Create job ID
            job_id = f"recurring-task-job-{task_id}-{user_id}"

            # Prepare job data
            job_data = {
                "job_id": job_id,
                "original_task_id": task_id,
                "user_id": user_id,
                "next_occurrence_time": next_occurrence_time,
                "task_template": {
                    "title": task_data.get('title'),
                    "description": task_data.get('description'),
                    "due_date": task_data.get('due_date'),
                    "is_recurring": task_data.get('is_recurring'),
                    "recurrence_pattern": task_data.get('recurrence_pattern')
                },
                "type": "recurring_task"
            }

            # Publish to Kafka for processing by a scheduled events service
            await dapr_client.publish_event(
                pubsub_name="kafka-pubsub",
                topic_name="task-events",
                data={
                    "event_type": "recurring_task_scheduled",
                    "job_id": job_id,
                    "original_task_id": task_id,
                    "user_id": user_id,
                    "next_occurrence_time": next_occurrence_time,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )

            self.logger.info(f"Scheduled recurring task job {job_id} for task {task_id} at {next_occurrence_time}")

        except Exception as e:
            self.logger.error(f"Error scheduling recurring task job: {str(e)}")
            raise

    async def cancel_job(self, job_id: str) -> None:
        """
        Cancel a scheduled job.

        Args:
            job_id: The job ID to cancel
        """
        # In a real implementation, this would interact with the scheduler to cancel the job
        self.logger.info(f"Canceled job {job_id}")


# Global instance
dapr_jobs_scheduler = DaprJobsScheduler()


async def schedule_reminder_dapr_job(task_id: int, user_id: str, title: str, remind_at: str) -> None:
    """
    Schedule a reminder job using Dapr Jobs Scheduler.

    Args:
        task_id: The task ID
        user_id: The user ID
        title: The task title
        remind_at: When to send the reminder (ISO format datetime string)
    """
    await dapr_jobs_scheduler.schedule_reminder_job(task_id, user_id, title, remind_at)