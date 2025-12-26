"""API routes for Todo AI Chatbot"""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta
import uuid
import time
import logging
import json

from src.api.dependencies import get_db, get_current_user, limiter
from src.models.conversation import Conversation
from src.models.message import Message
from src.agents.orchestrator import OrchestratorAgent
from src.agents.language_detector import detect_language

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize orchestrator agent (singleton for performance)
orchestrator = OrchestratorAgent()


class ChatRequest(BaseModel):
    """Chat request from user"""

    message: str


class ChatResponse(BaseModel):
    """Chat response to user"""

    response: str
    conversation_id: int


@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    chat_request: ChatRequest,
    response: Response,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Main chat endpoint for conversational task management.

    Implements User Story 1 (P1): Add Tasks via Natural Language
    Implements T082: Request ID Generation
    Implements T083: Performance Monitoring

    Steps:
    1. Generate request ID and start performance tracking
    2. Validate user_id matches JWT token
    3. Load or create conversation
    4. Load conversation history (last 10 messages)
    5. Process message with Orchestrator agent
    6. Persist user message and assistant response
    7. Log performance metrics and return response with request ID

    Args:
        user_id: User ID from URL path
        chat_request: Chat request with user message
        response: FastAPI response object for setting headers
        db: Database session
        current_user: User ID from JWT token

    Returns:
        ChatResponse: Assistant response and conversation ID

    Raises:
        HTTPException: 403 if user_id doesn't match JWT token
    """
    # T082: Generate request ID for traceability
    request_id = str(uuid.uuid4())

    # T083: Start performance tracking
    start_time = time.time()

    # Log request start with request ID
    logger.info("Chat request started: %s", json.dumps({
        "request_id": request_id,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat()
    }))

    try:
        # Step 1: Verify user_id matches authenticated user (FR-015: User Isolation)
        if user_id != current_user:
            raise HTTPException(
                status_code=403, detail="Forbidden: user_id does not match authenticated user"
            )

        # Step 2: Load or create active conversation
        conversation = _get_or_create_conversation(db, user_id)

        # Step 3: Load conversation history (last 10 messages for context)
        history = _load_conversation_history(db, conversation.id, limit=10)

        # Step 3.5: Detect language from user message
        detected_language = detect_language(chat_request.message)

        # Step 4: Process message with Orchestrator agent
        try:
            assistant_response = orchestrator.process_message(
                user_id=user_id, message=chat_request.message, conversation_history=history, db=db, language=detected_language
            )
        except Exception as e:
            # Handle agent processing errors
            raise HTTPException(
                status_code=500, detail=f"Error processing message: {str(e)}"
            )

        # Step 5: Persist user message and assistant response (FR-014: Audit Logging)
        _persist_messages(
            db=db,
            conversation_id=conversation.id,
            user_id=user_id,
            user_message=chat_request.message,
            assistant_response=assistant_response,
        )

        # Update conversation activity
        conversation.last_activity_at = datetime.utcnow()
        db.add(conversation)
        db.commit()

        # T083: Calculate response time
        elapsed_ms = int((time.time() - start_time) * 1000)

        # Log performance metrics
        logger.info("Chat request completed: %s", json.dumps({
            "request_id": request_id,
            "user_id": user_id,
            "response_time_ms": elapsed_ms,
            "timestamp": datetime.utcnow().isoformat()
        }))

        # SC-003: Warn on slow responses (p95 latency > 2000ms)
        if elapsed_ms > 2000:
            logger.warning("Slow response detected: %s", json.dumps({
                "request_id": request_id,
                "user_id": user_id,
                "response_time_ms": elapsed_ms
            }))

        # T082: Add request ID to response headers for traceability
        response.headers["X-Request-ID"] = request_id

        # Step 6: Return response
        return ChatResponse(response=assistant_response, conversation_id=conversation.id)

    except HTTPException:
        # Re-raise HTTP exceptions as-is, but log them with performance data
        elapsed_ms = int((time.time() - start_time) * 1000)
        logger.error("Chat request failed (HTTP exception): %s", json.dumps({
            "request_id": request_id,
            "user_id": user_id,
            "response_time_ms": elapsed_ms,
            "timestamp": datetime.utcnow().isoformat()
        }))
        raise

    except Exception as e:
        # Log unexpected errors with performance data
        elapsed_ms = int((time.time() - start_time) * 1000)
        logger.error("Chat request failed: %s", json.dumps({
            "request_id": request_id,
            "user_id": user_id,
            "response_time_ms": elapsed_ms,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }))
        raise


def _get_or_create_conversation(db: Session, user_id: str) -> Conversation:
    """
    Get active conversation or create new one.

    Args:
        db: Database session
        user_id: User ID

    Returns:
        Conversation: Active conversation for user
    """
    # Check for active conversation
    statement = select(Conversation).where(
        Conversation.user_id == user_id, Conversation.is_active == True
    )
    conversation = db.exec(statement).first()

    if conversation:
        # Check if conversation is still active (30 minute timeout per spec)
        if datetime.utcnow() - conversation.last_activity_at < timedelta(minutes=30):
            return conversation

        # Expire old conversation
        conversation.is_active = False
        db.add(conversation)
        db.commit()

    # Create new conversation
    conversation = Conversation(
        user_id=user_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        is_active=True,
        last_activity_at=datetime.utcnow(),
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def _load_conversation_history(
    db: Session, conversation_id: int, limit: int = 10
) -> List[dict]:
    """
    Load recent messages from conversation for context.

    Args:
        db: Database session
        conversation_id: Conversation ID
        limit: Maximum number of messages to load

    Returns:
        List[dict]: Recent messages in chronological order
    """
    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )
    messages = db.exec(statement).all()

    # Reverse to chronological order and convert to dict
    history = []
    for message in reversed(messages):
        history.append({"role": message.role, "content": message.content})

    return history


def _persist_messages(
    db: Session,
    conversation_id: int,
    user_id: str,
    user_message: str,
    assistant_response: str,
) -> None:
    """
    Persist user message and assistant response to database.

    Implements FR-014 (Audit Logging) by storing all messages.

    Args:
        db: Database session
        conversation_id: Conversation ID
        user_id: User ID
        user_message: User's message
        assistant_response: Assistant's response
    """
    # Persist user message
    user_msg = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role="user",
        content=user_message,
        created_at=datetime.utcnow(),
    )
    db.add(user_msg)

    # Persist assistant response
    # Note: tool_name, tool_input, tool_output would be populated here
    # if we tracked tool invocations (future enhancement)
    assistant_msg = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role="assistant",
        content=assistant_response,
        created_at=datetime.utcnow(),
    )
    db.add(assistant_msg)

    db.commit()
