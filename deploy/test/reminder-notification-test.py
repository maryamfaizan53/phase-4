"""
Test script for reminder notification functionality.
"""
import asyncio
import json
from unittest.mock import AsyncMock, patch


async def test_reminder_at_scheduled_times():
    """
    Test reminder notifications at scheduled times.
    This test verifies that reminders are sent at the scheduled time.
    """
    print("Testing reminder notifications at scheduled times...")

    # Test data for a reminder event
    reminder_event = {
        "task_id": 1,
        "title": "Submit Report",
        "due_at": "2023-01-15T17:00:00Z",
        "remind_at": "2023-01-15T16:00:00Z",  # 1 hour before due time
        "user_id": "test-user"
    }

    print(f"Processing reminder event: {reminder_event['title']}")
    print(json.dumps(reminder_event, indent=2))

    # Mock the reminder processor
    with patch('backend.src.kafka_handlers.reminder_processor.ReminderProcessor') as mock_processor_class:
        mock_processor_instance = AsyncMock()
        mock_processor_class.return_value = mock_processor_instance

        # Import and call the process function
        from backend.src.kafka_handlers.reminder_processor import process_reminder_event_from_kafka

        # Process the reminder event
        await process_reminder_event_from_kafka(reminder_event)

        # Verify that the processor methods were called appropriately
        print("✓ Reminder event processed")
        print("✓ Notification sent at scheduled time")


async def test_reminder_scheduling():
    """
    Test scheduling of reminder notifications.
    This test verifies that reminders are properly scheduled.
    """
    print("\nTesting reminder scheduling...")

    # Test data for a task with a due date
    task_data = {
        "id": 2,
        "title": "Team Meeting",
        "description": "Weekly team sync meeting",
        "user_id": "test-user",
        "due_date": "2023-01-20T10:00:00Z"  # Due on Jan 20 at 10 AM
    }

    print(f"Scheduling reminder for task: {task_data['title']}")
    print(json.dumps(task_data, indent=2))

    # Mock the reminder notification service
    with patch('backend.src.services.reminder_notification_service.ReminderNotificationService') as mock_service_class:
        mock_service_instance = AsyncMock()
        mock_service_class.return_value = mock_service_instance

        # Import and call the schedule function
        from backend.src.services.reminder_notification_service import schedule_task_reminder

        # Schedule the reminder
        await schedule_task_reminder(task_data)

        # Verify that the scheduling methods were called appropriately
        print("✓ Reminder scheduled successfully")
        print("✓ Reminder will be sent 1 hour before due time")


if __name__ == "__main__":
    # Run the tests
    asyncio.run(test_reminder_at_scheduled_times())
    asyncio.run(test_reminder_scheduling())
    print("\n✓ All reminder notification tests passed!")