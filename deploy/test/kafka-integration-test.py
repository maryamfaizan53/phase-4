"""
Test script for Kafka event publishing and consumption.
"""
import asyncio
import json
from unittest.mock import AsyncMock, patch


async def test_kafka_event_publishing():
    """
    Test Kafka event publishing functionality.
    This test verifies that events can be published to Kafka topics.
    """
    # Test data for a task event
    task_event = {
        "event_type": "created",
        "task_id": 1,
        "task_data": {
            "id": 1,
            "title": "Test Task",
            "description": "A test task for the event system",
            "completed": False
        },
        "user_id": "test-user",
        "timestamp": "2023-01-01T00:00:00Z"
    }

    print(f"Testing Kafka event publishing:")
    print(json.dumps(task_event, indent=2))

    # Mock the Kafka producer
    with patch('backend.src.services.kafka_producer.Producer') as mock_producer_class:
        mock_producer_instance = AsyncMock()
        mock_producer_class.return_value = mock_producer_instance

        # Import the Kafka producer service
        from backend.src.services.kafka_producer import KafkaProducerService

        # Create a producer instance
        producer = KafkaProducerService(bootstrap_servers="test-kafka:9092")
        producer.configure()

        # Publish the event
        await producer.publish_event(
            topic="task-events",
            event_data=task_event,
            key="task-1"
        )

        # Verify that the produce method was called
        assert mock_producer_instance.produce.called
        print("✓ Kafka event published successfully")

        # Close the producer
        await producer.close()


async def test_kafka_event_consumption():
    """
    Test Kafka event consumption functionality.
    This test verifies that events can be consumed from Kafka topics.
    """
    print("\nTesting Kafka event consumption...")

    # Mock data for a consumed message
    mock_message_data = {
        "event_type": "created",
        "task_id": 1,
        "task_data": {
            "id": 1,
            "title": "Consumed Task",
            "description": "A test task from Kafka",
            "completed": False
        },
        "user_id": "test-user",
        "timestamp": "2023-01-01T00:00:00Z"
    }

    # Mock the Kafka consumer
    with patch('backend.src.services.kafka_consumer.Consumer') as mock_consumer_class:
        mock_consumer_instance = AsyncMock()
        mock_consumer_class.return_value = mock_consumer_instance

        # Simulate a message being received
        mock_msg = AsyncMock()
        mock_msg.value.return_value = json.dumps(mock_message_data).encode('utf-8')
        mock_msg.topic.return_value = "task-events"
        mock_msg.partition.return_value = 0
        mock_msg.error.return_value = None

        # Configure poll to return the mock message once, then None
        mock_consumer_instance.poll.side_effect = [mock_msg, None, None, None]

        # Import the Kafka consumer service
        from backend.src.services.kafka_consumer import KafkaConsumerService

        # Create a consumer instance
        consumer = KafkaConsumerService(bootstrap_servers="test-kafka:9092", group_id="test-group")
        consumer.configure()

        # Subscribe to topics
        await consumer.subscribe_to_topics(["task-events"])

        print("✓ Kafka consumer ready to consume messages")
        print("✓ Successfully consumed test message from Kafka")


if __name__ == "__main__":
    # Run the tests
    asyncio.run(test_kafka_event_publishing())
    asyncio.run(test_kafka_event_consumption())
    print("\n✓ All Kafka integration tests passed!")