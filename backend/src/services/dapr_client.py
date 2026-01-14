"""
Dapr client service for inter-service communication.
"""
import asyncio
from typing import Any, Dict, Optional
import httpx
from dapr.clients import DaprClient
from ..config import settings


class DaprServiceClient:
    """
    Client for Dapr service invocation and communication.
    """

    def __init__(self):
        self.dapr_http_port = getattr(settings, 'DAPR_HTTP_PORT', 3500)
        self.dapr_grpc_port = getattr(settings, 'DAPR_GRPC_PORT', 50001)

    async def invoke_method(
        self,
        app_id: str,
        method_name: str,
        data: Optional[Dict[str, Any]] = None,
        verb: str = "POST"
    ) -> Dict[str, Any]:
        """
        Invoke a method on another service via Dapr.

        Args:
            app_id: The ID of the target application
            method_name: The method to invoke
            data: Optional data to send with the request
            verb: HTTP verb to use (GET, POST, PUT, DELETE, etc.)

        Returns:
            Response data from the target service
        """
        dapr_base_url = f"http://localhost:{self.dapr_http_port}/v1.0"
        url = f"{dapr_base_url}/invoke/{app_id}/method/{method_name}"

        headers = {
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            try:
                if verb.upper() == "GET":
                    response = await client.get(url, headers=headers)
                elif verb.upper() == "POST":
                    response = await client.post(url, json=data, headers=headers)
                elif verb.upper() == "PUT":
                    response = await client.put(url, json=data, headers=headers)
                elif verb.upper() == "DELETE":
                    response = await client.delete(url, headers=headers)
                else:
                    raise ValueError(f"Unsupported HTTP verb: {verb}")

                response.raise_for_status()
                return response.json() if response.content else {}

            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr invocation failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr invocation: {e}")

    async def publish_event(
        self,
        pubsub_name: str,
        topic_name: str,
        data: Dict[str, Any]
    ) -> None:
        """
        Publish an event to a Dapr pubsub component.

        Args:
            pubsub_name: Name of the pubsub component
            topic_name: Name of the topic to publish to
            data: Event data to publish
        """
        dapr_base_url = f"http://localhost:{self.dapr_http_port}/v1.0"
        url = f"{dapr_base_url}/publish/{pubsub_name}/{topic_name}"

        headers = {
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=data, headers=headers)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr publish failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr publish: {e}")

    async def get_secret(
        self,
        secret_store_name: str,
        key: str,
        metadata: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Retrieve a secret from Dapr secret store.

        Args:
            secret_store_name: Name of the secret store component
            key: Key of the secret to retrieve
            metadata: Optional metadata for the secret store

        Returns:
            The secret value
        """
        dapr_base_url = f"http://localhost:{self.dapr_http_port}/v1.0"
        url = f"{dapr_base_url}/secrets/{secret_store_name}/{key}"

        if metadata:
            # Convert metadata dict to query string
            params = "&".join([f"metadata.{k}={v}" for k, v in metadata.items()])
            url += f"?{params}"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                secret_data = response.json()
                # Return the value associated with the key
                return secret_data.get(key, "")
            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr secret retrieval failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr secret retrieval: {e}")


# Global instance
dapr_client = DaprServiceClient()