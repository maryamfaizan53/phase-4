"""
Dapr state management service for storing and retrieving state.
"""
import json
from typing import Any, Dict, List, Optional
import httpx
from dapr.clients.exceptions import DaprGrpcError


class DaprStateService:
    """
    Service for managing state using Dapr's state management building block.
    """

    def __init__(self, dapr_http_port: int = 3500):
        self.dapr_http_port = dapr_http_port
        self.dapr_base_url = f"http://localhost:{dapr_http_port}/v1.0"

    async def save_state(
        self,
        store_name: str,
        key: str,
        value: Any,
        etag: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Save state to a Dapr state store.

        Args:
            store_name: Name of the state store component
            key: Key for the state
            value: Value to store
            etag: Optional etag for concurrency control
            options: Optional state options
        """
        url = f"{self.dapr_base_url}/state/{store_name}"

        state_item = {
            "key": key,
            "value": value
        }

        if etag:
            state_item["etag"] = etag

        if options:
            state_item["options"] = options

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=[state_item],
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr save state failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr save state: {e}")

    async def get_state(
        self,
        store_name: str,
        key: str,
        consistency: Optional[str] = " eventual"
    ) -> Any:
        """
        Get state from a Dapr state store.

        Args:
            store_name: Name of the state store component
            key: Key for the state
            consistency: Consistency level ("eventual" or "strong")

        Returns:
            The stored value
        """
        url = f"{self.dapr_base_url}/state/{store_name}/{key}"

        params = {}
        if consistency:
            params["consistency"] = consistency.lstrip()  # Remove leading space

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()

                # Return the value directly if it's JSON, otherwise return as text
                try:
                    return response.json()
                except json.JSONDecodeError:
                    return response.text
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    return None  # Key not found
                raise Exception(f"Dapr get state failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr get state: {e}")

    async def get_bulk_state(
        self,
        store_name: str,
        keys: List[str],
        parallelism: int = 1,
        consistency: Optional[str] = "eventual"
    ) -> Dict[str, Any]:
        """
        Get multiple states from a Dapr state store.

        Args:
            store_name: Name of the state store component
            keys: List of keys to retrieve
            parallelism: Number of parallel operations
            consistency: Consistency level ("eventual" or "strong")

        Returns:
            Dictionary mapping keys to values
        """
        url = f"{self.dapr_base_url}/state/{store_name}/bulk"

        payload = {
            "keys": keys,
            "parallelism": parallelism
        }

        if consistency:
            payload["consistency"] = consistency

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr bulk get state failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr bulk get state: {e}")

    async def delete_state(
        self,
        store_name: str,
        key: str,
        etag: Optional[str] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Delete state from a Dapr state store.

        Args:
            store_name: Name of the state store component
            key: Key for the state to delete
            etag: Optional etag for concurrency control
            options: Optional state options
        """
        url = f"{self.dapr_base_url}/state/{store_name}/{key}"

        params = {}
        if etag:
            params["etag"] = etag

        if options:
            # Options need to be passed as query parameters
            for opt_key, opt_val in options.items():
                params[opt_key] = opt_val

        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(url, params=params)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                if e.response.status_code != 404:
                    # 404 is acceptable (key doesn't exist)
                    raise Exception(f"Dapr delete state failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr delete state: {e}")

    async def execute_transaction(
        self,
        store_name: str,
        operations: List[Dict[str, Any]]
    ) -> None:
        """
        Execute a transaction with multiple operations on a Dapr state store.

        Args:
            store_name: Name of the state store component
            operations: List of operations (upsert, delete) to execute
        """
        url = f"{self.dapr_base_url}/state/{store_name}/transaction"

        payload = {
            "operations": operations
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload)
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise Exception(f"Dapr transaction failed: {e}")
            except Exception as e:
                raise Exception(f"Unexpected error during Dapr transaction: {e}")


# Global instance
dapr_state_service = DaprStateService()