"""
Kafka producer service for publishing events to Kafka topics.
"""
from typing import Dict, Any, Optional
import json
import asyncio
from aiokafka import AIOKafkaProducer
from confluent_kafka import Producer
import logging


class KafkaProducerService:
    """
    Service for producing/publishing messages to Kafka topics.
    """

    def __init__(self, bootstrap_servers: str = "localhost:9092"):
        self.bootstrap_servers = bootstrap_servers
        self.producer: Optional[Producer] = None
        self._configured = False
        self.logger = logging.getLogger(__name__)

    def configure(self):
        """
        Configure the Kafka producer with appropriate settings.
        """
        if self._configured:
            return

        # Configuration for the Kafka producer
        self.producer_config = {
            'bootstrap.servers': self.bootstrap_servers,
            'acks': 'all',  # Wait for all replicas to acknowledge
            'retries': 3,
            'batch.size': 16384,
            'linger.ms': 5,
            'buffer.memory': 33554432,
            'key.serializer': str.encode,
            'value.serializer': lambda x: json.dumps(x).encode('utf-8')
        }

        # Create the producer instance
        self.producer = Producer(self.producer_config)
        self._configured = True
        self.logger.info(f"Kafka producer configured for servers: {self.bootstrap_servers}")

    def _delivery_report(self, err, msg):
        """
        Callback for reporting message delivery status.
        """
        if err is not None:
            self.logger.error(f'Message delivery failed: {err}')
        else:
            self.logger.info(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    async def publish_event(
        self,
        topic: str,
        event_data: Dict[str, Any],
        key: Optional[str] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> None:
        """
        Publish an event to the specified Kafka topic.

        Args:
            topic: The Kafka topic to publish to
            event_data: The event data to publish
            key: Optional key for partitioning
            headers: Optional headers for the message
        """
        if not self._configured:
            self.configure()

        if not self.producer:
            raise RuntimeError("Kafka producer not initialized")

        # Prepare the message value
        value = json.dumps(event_data)

        # Prepare headers if provided
        message_headers = headers or {}

        try:
            # Asynchronously produce the message
            self.producer.produce(
                topic=topic,
                value=value,
                key=key,
                headers=message_headers,
                callback=self._delivery_report
            )

            # Poll for delivery reports and handle callbacks
            self.producer.poll(0)

            self.logger.info(f"Published event to topic '{topic}' with key '{key}'")

        except Exception as e:
            self.logger.error(f"Failed to publish event to topic '{topic}': {str(e)}")
            raise

    async def flush(self):
        """
        Flush the producer to ensure all messages are sent.
        """
        if self.producer:
            remaining = self.producer.flush()
            self.logger.info(f"Flushed producer, {remaining} messages remaining")

    async def close(self):
        """
        Close the Kafka producer and clean up resources.
        """
        if self.producer:
            self.flush()
            self.logger.info("Kafka producer closed")


# Global instance
kafka_producer_service = KafkaProducerService()


def get_kafka_producer() -> KafkaProducerService:
    """
    Get the global Kafka producer instance.
    """
    return kafka_producer_service