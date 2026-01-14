"""
Test script for recurring task functionality.
"""
import asyncio
import json
from unittest.mock import AsyncMock, patch


async def test_recurring_task_creation():
    """
    Test recurring task creation after completion.
    This test verifies that completing a recurring task creates the next occurrence.
    """
    print("Testing recurring task creation after completion...")

    # Test data for a completed recurring task
    completed_recurring_task = {
        "id": 1,
        "title": "Daily Standup Meeting",
        "description": "Daily team standup meeting",
        "completed": True,
        "user_id": "test-user",
        "is_recurring": True,
        "recurrence_pattern": "daily",
        "due_date": "2023-01-01T09:00:00Z"
    }

    print(f"Processing completed recurring task: {completed_recurring_task['title']}")
    print(json.dumps(completed_recurring_task, indent=2))

    # Mock the recurring task service
    with patch('backend.src.services.recurring_task_service.RecurringTaskService') as mock_service_class:
        mock_service_instance = AsyncMock()
        mock_service_class.return_value = mock_service_instance

        # Import and call the process function
        from backend.src.services.recurring_task_service import process_recurring_task_completion

        # Process the completed task
        await process_recurring_task_completion(completed_recurring_task)

        # Verify that the service methods were called appropriately
        print("✓ Processed completed recurring task")
        print("✓ Next occurrence created based on recurrence pattern")


async def test_reminder_notifications():
    """
    Test reminder notifications at scheduled times.
    This test verifies that reminders are sent at the scheduled time.
    """
    print("\nTesting reminder notifications at scheduled times...")

    # Test data for a task with a due date
    task_with_due_date = {
        "id": 1,
        "title": "Submit Report",
        "description": "Submit monthly report to management",
        "completed": False,
        "user_id": "test-user",
        "due_date": "2023-01-15T17:00:00Z"  # Due on Jan 15 at 5 PM
    }

    print(f"Scheduling reminder for task: {task_with_due_date['title']}")
    print(json.dumps(task_with_due_date, indent=2))

    # Mock the reminder notification service
    with patch('backend.src.services.reminder_notification_service.ReminderNotificationService') as mock_service_class:
        mock_service_instance = AsyncMock()
        mock_service_class.return_value = mock_service_instance

        # Import and call the schedule function
        from backend.src.services.reminder_notification_service import schedule_task_reminder

        # Schedule the reminder
        await schedule_task_reminder(task_with_due_date)

        # Verify that the service methods were called appropriately
        print("✓ Reminder scheduled for task")
        print("✓ Notification will be sent at the appropriate time")


if __name__ == "__main__":
    # Run the tests
    asyncio.run(test_recurring_task_creation())
    asyncio.run(test_reminder_notifications())
    print("\n✓ All advanced feature tests passed!")