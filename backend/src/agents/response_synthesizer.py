"""Response Synthesizer Agent - Converts tool results to natural language"""
from typing import Dict
from src.agents.llm_client import llm_client


class ResponseSynthesizerAgent:
    """
    Response Synthesizer sub-agent for converting tool results to natural language.

    Takes structured tool outputs and generates human-friendly conversational responses.
    """

    def __init__(self, use_llm: bool = True):
        """Initialize Response Synthesizer agent"""
        self.use_llm = use_llm
        self.system_prompt = """You are a friendly and helpful todo management assistant.

Your job is to convert tool results into natural, conversational responses.

Guidelines:
- Be warm, friendly, and encouraging
- Confirm actions clearly and concisely
- Include task details (ID, title, priority) in confirmations
- Mention priority when it's urgent or high (e.g., "urgent task", "high priority")
- Provide helpful suggestions when things go wrong
- Keep responses brief (1-2 sentences for simple confirmations)
- Use a casual, conversational tone

Priority levels:
- urgent: Critical, needs immediate attention
- high: Important, should be done soon
- medium: Normal priority (default)
- low: Can be done when you have time

Examples:
- Task added: "Got it! I've added 'buy groceries' to your list as task #5 (medium priority)."
- Urgent task added: "⚠️ Added urgent task #7: 'fix production bug'. This needs immediate attention!"
- High priority task: "✨ Added high priority task #3: 'call client'. Make sure to do this soon!"
- Task completed: "Awesome! Marked task #3 'call dentist' as complete. One less thing to worry about!"
- Task deleted: "Done! Removed task #2 from your list."
- Priority updated: "Updated task #5 to high priority. Moving it up your list!"
"""

    def synthesize_response(self, tool_result: Dict) -> str:
        """
        Convert tool result to natural language response.

        Args:
            tool_result: Result from MCP tool execution

        Returns:
            str: Natural language response
        """
        # If LLM is enabled, use it for more natural responses
        if self.use_llm:
            return self._synthesize_with_llm(tool_result)

        # Fallback to rule-based synthesis
        if tool_result.get("success"):
            return self._synthesize_success(tool_result)
        return self._synthesize_error(tool_result)

    def _synthesize_with_llm(self, tool_result: Dict) -> str:
        """Use LLM to generate natural language response"""
        try:
            # Create a prompt from the tool result
            user_prompt = f"Tool Result: {tool_result}\n\nConvert this into a friendly, conversational response for the user."

            response = llm_client.generate_response(
                system_prompt=self.system_prompt,
                user_message=user_prompt,
                temperature=0.7,
                max_tokens=150,
            )

            return response

        except Exception as e:
            print(f"LLM synthesis error: {e}")
            # Fallback to rule-based synthesis
            if tool_result.get("success"):
                return self._synthesize_success(tool_result)
            return self._synthesize_error(tool_result)

    def _synthesize_success(self, result: Dict) -> str:
        """Synthesize success response"""
        # update_task success
        if "updated_fields" in result:
            # Use the message from the tool with updated fields info
            return result["message"]

        # delete_task success (check message contains "deleted")
        if "task" in result and "message" in result:
            message = result["message"]
            # Add undo note for deletions
            if "deleted" in message.lower():
                # Note: This is a permanent deletion (no undo in current phase)
                # Future enhancement: implement soft delete or undo buffer
                return message
            # add_task, complete_task, or other task operations
            return message

        # list_tasks success
        if "tasks" in result:
            return self._format_task_list(result)

        # Generic success
        return "Done! Your request was processed successfully."

    def _format_task_list(self, result: Dict) -> str:
        """Format task list into natural language"""
        tasks = result.get("tasks", [])
        total_count = result.get("total_count", 0)
        has_more = result.get("has_more", False)
        message = result.get("message", "")

        # Empty list
        if total_count == 0:
            return message  # Use the friendly message from tool

        # Format task list
        response = f"{message}\n\n"

        for task in tasks:
            status_emoji = "✓" if task["status"] == "completed" else "○"

            # Priority emoji
            priority = task.get("priority", "medium")
            priority_emoji = {
                "urgent": "🔴",
                "high": "🟠",
                "medium": "🟡",
                "low": "🟢"
            }.get(priority, "🟡")

            response += f"{status_emoji} {priority_emoji} #{task['id']}: {task['title']}"
            if task.get("description"):
                response += f" - {task['description']}"
            response += "\n"

        # Add pagination hint if there are more tasks
        if has_more:
            response += "\n(Say 'show more tasks' to see additional tasks)"

        return response.strip()

    def _synthesize_error(self, result: Dict) -> str:
        """Synthesize error response"""
        error_code = result.get("error_code", "UNKNOWN")
        message = result.get("message", "Something went wrong")
        suggestion = result.get("suggestion")

        # Build friendly error message
        response = message

        if suggestion:
            response += f" {suggestion}"

        return response

    def synthesize_clarification(self, reason: str) -> str:
        """
        Generate clarification question when intent is unclear.

        Args:
            reason: Reason why clarification is needed

        Returns:
            str: Clarification question
        """
        if "missing task details" in reason.lower() or "ambiguous" in reason.lower():
            return "What task would you like me to add? Please provide more details."

        if "too short" in reason.lower():
            return "I didn't quite catch that. What would you like to do?"

        if "cannot extract" in reason.lower():
            return "I'm not sure what task you want to create. Could you describe it more clearly?"

        if "cannot identify which task" in reason.lower():
            return "Which task would you like to mark as complete? You can say the task number (e.g., 'task 5') or describe it."

        # Default clarification
        return "I'm not sure what you'd like me to do. Would you like to add a task, view your tasks, or mark one complete?"

    def synthesize_conversational_response(self, conversation_type: str) -> str:
        """
        Generate conversational response for non-task intents.

        Args:
            conversation_type: Type of conversation (greeting, gratitude, capabilities)

        Returns:
            str: Friendly conversational response
        """
        if conversation_type == "greeting":
            return "Hello! I'm your todo assistant. I can help you manage your tasks. Would you like to add a task, view your tasks, or something else?"

        if conversation_type == "gratitude":
            return "You're welcome! Let me know if you need anything else."

        if conversation_type == "capabilities":
            return """I can help you manage your tasks! Here's what I can do:

• Add tasks - Just tell me what you need to do (e.g., "remind me to buy groceries")
• View tasks - Say "show my tasks" to see all tasks, or filter by status
• Complete tasks - Mark tasks as done (e.g., "complete task 5")
• Update tasks - Change task titles or descriptions (e.g., "update task 3 to call dentist")
• Delete tasks - Remove tasks you no longer need (e.g., "delete task 2")

What would you like to do?"""

        # Default conversational response
        return "I'm here to help you manage your tasks. What would you like to do?"
