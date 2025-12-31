"""Orchestrator Agent - Main conversation coordinator"""
from typing import List, Dict, Optional
from sqlmodel import Session

from src.agents.intent_parser import IntentParserAgent
from src.agents.response_synthesizer import ResponseSynthesizerAgent
from src.mcp.tools.add_task import add_task, AddTaskInput
from src.mcp.tools.list_tasks import list_tasks, ListTasksInput
from src.mcp.tools.complete_task import complete_task, CompleteTaskInput
from src.mcp.tools.update_task import update_task, UpdateTaskInput
from src.mcp.tools.delete_task import delete_task, DeleteTaskInput
from sqlmodel import select
from src.models.task import Task


class OrchestratorAgent:
    """
    Orchestrator Agent - Main conversation coordinator.

    Coordinates Intent Parser and Response Synthesizer sub-agents,
    executes MCP tools, and manages conversation flow.
    """

    def __init__(self):
        """Initialize Orchestrator agent"""
        self.intent_parser = IntentParserAgent()
        self.response_synthesizer = ResponseSynthesizerAgent()
        self.ambiguity_threshold = 0.7  # Confidence threshold for clarity

    def process_message(
        self,
        user_id: str,
        message: str,
        conversation_history: List[Dict],
        db: Session,
        language: str = "en",
    ) -> str:
        """
        Process user message and return assistant response.

        This implements the 11-step conversation lifecycle from plan.md:
        1. Receive user message
        2. Validate user_id (done by caller)
        3. Load conversation history (done by caller)
        4. Orchestrator receives message + history (this method)
        5. Intent Parser analyzes input
        6. If ambiguous: ask clarifying question
        7. If clear: Execute MCP tool
        8. Tool queries/modifies database
        9. Response Synthesizer converts result to natural language
        10. Persist messages (done by caller)
        11. Return response to user

        Args:
            user_id: ID of the user sending the message
            message: User's natural language message
            conversation_history: Recent messages for context (last 10)
            db: Database session for tool execution
            language: Detected language ("en" for English, "ur" for Urdu)

        Returns:
            str: Assistant's natural language response
        """
        # Step 5: Intent Parser analyzes input with language awareness
        intent_result = self.intent_parser.parse_intent(message, language=language)

        intent = intent_result["intent"]
        confidence = intent_result["confidence"]
        parameters = intent_result.get("parameters", {})

        # Step 6: Check for ambiguity
        if intent == "unclear" or confidence < self.ambiguity_threshold:
            # Ask clarifying question
            reason = intent_result.get("reason", "unclear intent")
            return self.response_synthesizer.synthesize_clarification(reason)

        # Step 7: Execute MCP tool based on intent
        if intent == "add_task":
            # Extract parameters
            title = parameters.get("title")
            description = parameters.get("description")
            priority = parameters.get("priority", "medium")

            # Validate we have required parameters
            if not title or not title.strip():
                return self.response_synthesizer.synthesize_clarification(
                    "missing task details"
                )

            # Execute add_task tool
            tool_input = AddTaskInput(
                user_id=user_id, title=title, description=description, priority=priority
            )

            # Step 8: Tool queries/modifies database
            tool_result = add_task(db, tool_input)

            # Step 9: Response Synthesizer converts result to natural language
            return self.response_synthesizer.synthesize_response(tool_result)

        elif intent == "list_tasks":
            # Extract parameters
            status = parameters.get("status", "all")

            # Execute list_tasks tool
            tool_input = ListTasksInput(
                user_id=user_id,
                status=status,
                limit=20,  # Default from spec
                offset=0,  # TODO: Handle pagination in future enhancement
            )

            # Step 8: Tool queries database
            tool_result = list_tasks(db, tool_input)

            # Step 9: Response Synthesizer formats task list
            return self.response_synthesizer.synthesize_response(tool_result)

        elif intent == "complete_task":
            # Extract parameters
            task_id = parameters.get("task_id")
            task_title = parameters.get("task_title")

            # If task_id provided, use it directly
            if task_id:
                tool_input = CompleteTaskInput(user_id=user_id, task_id=task_id)
                tool_result = complete_task(db, tool_input)
                return self.response_synthesizer.synthesize_response(tool_result)

            # If task_title provided, search for matching task
            if task_title:
                # Search for task by title (case-insensitive, partial match)
                statement = (
                    select(Task)
                    .where(Task.user_id == user_id)
                    .where(Task.title.ilike(f"%{task_title}%"))
                    .where(Task.status == "pending")
                )
                matching_tasks = db.exec(statement).all()

                if len(matching_tasks) == 0:
                    return "I couldn't find a pending task matching that description. Would you like to see your current tasks?"
                elif len(matching_tasks) == 1:
                    # Single match - complete it
                    tool_input = CompleteTaskInput(
                        user_id=user_id, task_id=matching_tasks[0].id
                    )
                    tool_result = complete_task(db, tool_input)
                    return self.response_synthesizer.synthesize_response(tool_result)
                else:
                    # Multiple matches - ask for clarification
                    response = f"I found {len(matching_tasks)} tasks matching that description:\n\n"
                    for task in matching_tasks[:5]:  # Show up to 5
                        response += f"○ #{task.id}: {task.title}\n"
                    response += "\nWhich one would you like to mark as complete? (specify the task number)"
                    return response

            # Shouldn't reach here, but handle gracefully
            return self.response_synthesizer.synthesize_clarification(
                "Cannot identify which task to complete"
            )

        elif intent == "update_task":
            # Extract parameters
            task_id = parameters.get("task_id")
            new_title = parameters.get("title")
            new_description = parameters.get("description")
            new_priority = parameters.get("priority")

            # Validate we have task_id and at least one field to update
            if not task_id:
                return self.response_synthesizer.synthesize_clarification(
                    "Cannot identify which task to update"
                )

            if not new_title and not new_description and not new_priority:
                return self.response_synthesizer.synthesize_clarification(
                    "Cannot determine what to update"
                )

            # Execute update_task tool
            tool_input = UpdateTaskInput(
                user_id=user_id,
                task_id=task_id,
                title=new_title,
                description=new_description,
                priority=new_priority,
            )

            # Step 8: Tool modifies database
            tool_result = update_task(db, tool_input)

            # Step 9: Response Synthesizer formats update confirmation
            return self.response_synthesizer.synthesize_response(tool_result)

        elif intent == "delete_task":
            # Extract parameters
            task_id = parameters.get("task_id")

            # Validate we have task_id
            if not task_id:
                return self.response_synthesizer.synthesize_clarification(
                    "Cannot identify which task to delete"
                )

            # Execute delete_task tool
            tool_input = DeleteTaskInput(user_id=user_id, task_id=task_id)

            # Step 8: Tool modifies database
            tool_result = delete_task(db, tool_input)

            # Step 9: Response Synthesizer formats deletion confirmation
            return self.response_synthesizer.synthesize_response(tool_result)

        elif intent == "conversational":
            # Handle conversational intents (greetings, gratitude, capabilities)
            conversation_type = parameters.get("conversation_type", "general")
            return self.response_synthesizer.synthesize_conversational_response(
                conversation_type
            )

        # Fallback for unrecognized intents
        return "I'm sorry, I can help you add tasks, view tasks, mark them complete, update them, or delete them. What would you like to do?"

    def detect_ambiguity(self, intent_result: Dict) -> bool:
        """
        Detect if user intent is ambiguous and requires clarification.

        Args:
            intent_result: Result from Intent Parser

        Returns:
            bool: True if ambiguous, False if clear
        """
        intent = intent_result["intent"]
        confidence = intent_result["confidence"]

        # Unclear intent
        if intent == "unclear":
            return True

        # Low confidence
        if confidence < self.ambiguity_threshold:
            return True

        # Check for required parameters based on intent
        parameters = intent_result.get("parameters", {})

        if intent == "add_task":
            # Title is required for add_task
            title = parameters.get("title")
            if not title or not title.strip() or len(title.strip()) < 2:
                return True

        return False
