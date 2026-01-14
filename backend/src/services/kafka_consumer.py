"""
Kafka consumer service for consuming events from Kafka topics.
"""
from typing import Dict, Any, Callable, List, Optional
import json
import asyncio
from confluent_kafka import Consumer, KafkaException
import logging


class KafkaConsumerService:
    """
    Service for consuming messages from Kafka topics.
    """

    def __init__(self, bootstrap_servers: str = "localhost:9092", group_id: str = "todo-service"):
        self.bootstrap_servers = bootstrap_servers
        self.group_id = group_id
        self.consumer: Optional[Consumer] = None
        self._configured = False
        self.logger = logging.getLogger(__name__)

    def configure(self):
        """
        Configure the Kafka consumer with appropriate settings.
        """
        if self._configured:
            return

        # Configuration for the Kafka consumer
        self.consumer_config = {
            'bootstrap.servers': self.bootstrap_servers,
            'group.id': self.group_id,
            'auto.offset.reset': 'earliest',  # Start from the beginning if no committed offset
            'enable.auto.commit': True,
            'auto.commit.interval.ms': 1000,
            'max.poll.interval.ms': 300000,  # 5 minutes
            'session.timeout.ms': 10000,
            'heartbeat.interval.ms': 3000,
            'key.deserializer': lambda x: x.decode('utf-8') if x else None,
            'value.deserializer': lambda x: json.loads(x.decode('utf-8')) if x else None
        }

        # Create the consumer instance
        self.consumer = Consumer(self.consumer_config)
        self._configured = True
        self.logger.info(f"Kafka consumer configured for servers: {self.bootstrap_servers}, group: {self.group_id}")

    async def subscribe_to_topics(self, topics: List[str]):
        """
        Subscribe to the specified Kafka topics.

        Args:
            topics: List of topic names to subscribe to
        """
        if not self._configured:
            self.configure()

        if not self.consumer:
            raise RuntimeError("Kafka consumer not initialized")

        try:
            self.consumer.subscribe(topics)
            self.logger.info(f"Subscribed to topics: {topics}")
        except Exception as e:
            self.logger.error(f"Failed to subscribe to topics {topics}: {str(e)}")
            raise

    async def consume_messages(self, message_handler: Callable[[Dict[str, Any]], None], timeout: float = 1.0):
        """
        Consume messages from subscribed topics and process them using the provided handler.

        Args:
            message_handler: Function to handle received messages
            timeout: Timeout for polling messages (seconds)
        """
        if not self.consumer:
            raise RuntimeError("Kafka consumer not initialized")

        try:
            while True:
                # Poll for messages
                msg = self.consumer.poll(timeout=timeout)

                if msg is None:
                    # No message received within timeout
                    continue

                if msg.error():
                    # Handle Kafka errors
                    if msg.error().code() == KafkaException.ERR__PARTITION_EOF:
                        # End of partition reached, not an error
                        continue
                    else:
                        self.logger.error(f"Kafka error: {msg.error()}")
                        continue

                try:
                    # Decode the message value
                    message_value = json.loads(msg.value().decode('utf-8'))

                    # Process the message
                    await message_handler(message_value)

                    # Commit the offset after processing
                    self.consumer.commit(msg)

                    self.logger.info(f"Processed message from topic {msg.topic()}, partition {msg.partition()}")

                except json.JSONDecodeError:
                    self.logger.error(f"Failed to decode JSON from message: {msg.value()}")
                except Exception as e:
                    self.logger.error(f"Error processing message: {str(e)}")
                    # Depending on error handling strategy, you might want to commit or not

        except KeyboardInterrupt:
            self.logger.info("Consumer interrupted by user")
        except Exception as e:
            self.logger.error(f"Error in message consumption loop: {str(e)}")
            raise

    async def get_single_message(self, timeout: float = 1.0):
        """
        Get a single message from the subscribed topic(s).

        Args:
            timeout: Timeout for polling message (seconds)

        Returns:
            The message value or None if no message received
        """
        if not self.consumer:
            raise RuntimeError("Kafka consumer not initialized")

        try:
            msg = self.consumer.poll(timeout=timeout)

            if msg is None:
                return None

            if msg.error():
                if msg.error().code() == KafkaException.ERR__PARTITION_EOF:
                    return None
                else:
                    raise KafkaException(msg.error())

            # Decode and return the message value
            message_value = json.loads(msg.value().decode('utf-8'))

            # Commit the offset after processing
            self.consumer.commit(msg)

            return message_value

        except json.JSONDecodeError:
            self.logger.error(f"Failed to decode JSON from message: {msg.value()}")
            return None
        except Exception as e:
            self.logger.error(f"Error getting single message: {str(e)}")
            raise

    async def close(self):
        """
        Close the Kafka consumer and clean up resources.
        """
        if self.consumer:
            self.consumer.close()
            self.logger.info("Kafka consumer closed")


# Global instance
kafka_consumer_service = KafkaConsumerService()


def get_kafka_consumer(group_id: str = "todo-service") -> KafkaConsumerService:
    """
    Get a Kafka consumer instance with the specified group ID.
    """
    return KafkaConsumerService(group_id=group_id)