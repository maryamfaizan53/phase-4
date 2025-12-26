"""LLM client for OpenRouter/OpenAI integration"""
import time
import logging
from openai import OpenAI, APIError, Timeout, RateLimitError, APIConnectionError, AuthenticationError
from src.config import settings
from typing import Optional, List, Dict

logger = logging.getLogger(__name__)


class LLMClient:
    """
    Unified LLM client for OpenRouter and OpenAI.

    Supports both OpenRouter (free models) and OpenAI API.
    """

    def __init__(self):
        """Initialize LLM client based on configuration"""
        if settings.LLM_PROVIDER == "openrouter":
            # Use OpenRouter API (compatible with OpenAI client)
            api_key = settings.OPENROUTER_API_KEY or settings.OPENAI_API_KEY
            self.client = OpenAI(
                base_url=settings.LLM_BASE_URL,
                api_key=api_key,
            )
            self.model = settings.LLM_MODEL
        else:
            # Use OpenAI API
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = settings.LLM_MODEL or "gpt-3.5-turbo"

    def generate_response(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 500,
        max_retries: int = 3,
    ) -> str:
        """
        Generate a response using the LLM with graceful error handling.

        Args:
            system_prompt: System instructions for the LLM
            user_message: User's message
            temperature: Creativity level (0.0 = deterministic, 1.0 = creative)
            max_tokens: Maximum response length
            max_retries: Maximum number of retry attempts for transient failures

        Returns:
            str: Generated response from LLM or user-friendly error message
        """
        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                    timeout=30.0,
                )

                return response.choices[0].message.content.strip()

            except Timeout:
                logger.warning(f"OpenAI API timeout (attempt {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.info(f"Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                return "I'm having trouble connecting right now. Please try again in a moment."

            except RateLimitError:
                logger.warning(f"OpenAI rate limit hit (attempt {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.info(f"Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                return "I'm experiencing high demand. Please try again in a minute."

            except AuthenticationError as e:
                logger.error(f"OpenAI authentication error: {str(e)}")
                return "I'm having trouble with my authentication. Please contact support."

            except APIConnectionError as e:
                logger.error(f"OpenAI connection error: {str(e)}")
                return "I'm having trouble connecting to my AI service. Please try again later."

            except APIError as e:
                logger.error(f"OpenAI API error: {str(e)}")
                if e.status_code and e.status_code >= 500:
                    # Server errors - might be transient
                    logger.warning(f"Server error (status {e.status_code}), attempt {attempt + 1}/{max_retries}")
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        logger.info(f"Retrying after {wait_time} seconds...")
                        time.sleep(wait_time)
                        continue
                return "I encountered an error processing your request. Please try again."

            except Exception as e:
                logger.exception(f"Unexpected error in LLM client: {str(e)}")
                return "I encountered an unexpected error. Please try again."

    def generate_with_history(
        self,
        system_prompt: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 500,
        max_retries: int = 3,
    ) -> str:
        """
        Generate a response with conversation history and graceful error handling.

        Args:
            system_prompt: System instructions
            messages: List of message dicts with 'role' and 'content'
            temperature: Creativity level
            max_tokens: Maximum response length
            max_retries: Maximum number of retry attempts for transient failures

        Returns:
            str: Generated response or user-friendly error message
        """
        for attempt in range(max_retries):
            try:
                # Build messages list
                chat_messages = [{"role": "system", "content": system_prompt}]
                chat_messages.extend(messages)

                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=chat_messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    timeout=30.0,
                )

                return response.choices[0].message.content.strip()

            except Timeout:
                logger.warning(f"OpenAI API timeout (attempt {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.info(f"Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                return "I'm having trouble connecting right now. Please try again in a moment."

            except RateLimitError:
                logger.warning(f"OpenAI rate limit hit (attempt {attempt + 1}/{max_retries})")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.info(f"Retrying after {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                return "I'm experiencing high demand. Please try again in a minute."

            except AuthenticationError as e:
                logger.error(f"OpenAI authentication error: {str(e)}")
                return "I'm having trouble with my authentication. Please contact support."

            except APIConnectionError as e:
                logger.error(f"OpenAI connection error: {str(e)}")
                return "I'm having trouble connecting to my AI service. Please try again later."

            except APIError as e:
                logger.error(f"OpenAI API error: {str(e)}")
                if e.status_code and e.status_code >= 500:
                    # Server errors - might be transient
                    logger.warning(f"Server error (status {e.status_code}), attempt {attempt + 1}/{max_retries}")
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        logger.info(f"Retrying after {wait_time} seconds...")
                        time.sleep(wait_time)
                        continue
                return "I encountered an error processing your request. Please try again."

            except Exception as e:
                logger.exception(f"Unexpected error in LLM client: {str(e)}")
                return "I encountered an unexpected error. Please try again."


# Global LLM client instance
llm_client = LLMClient()
