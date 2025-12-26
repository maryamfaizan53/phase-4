"""Intent Parser Agent - Classifies user intent and extracts parameters"""
from typing import Dict, Optional, Literal
import json


class IntentParserAgent:
    """
    Intent Parser sub-agent for analyzing natural language input.

    Classifies user intent into tool operations (add, list, complete, update, delete)
    and extracts parameters from natural language.
    
    Supports both English and Urdu language input.
    """

    def __init__(self):
        """Initialize Intent Parser agent"""
        self.system_prompt = """You are an intent classification agent for a todo management system.

Your job is to analyze user messages and determine:
1. The user's intent (add_task, list_tasks, complete_task, update_task, delete_task, conversational)
2. Extract relevant parameters from the message

For add_task intent:
- Extract the task title (required)
- Extract the task description (optional)

Return a JSON object with:
{
    "intent": "add_task" | "list_tasks" | "complete_task" | "update_task" | "delete_task" | "conversational" | "unclear",
    "confidence": 0.0 to 1.0,
    "parameters": {
        "title": "extracted title",
        "description": "extracted description" (optional)
    }
}

Examples:
- "Remind me to buy groceries" -> {"intent": "add_task", "confidence": 0.9, "parameters": {"title": "buy groceries"}}
- "Add task: call dentist for appointment" -> {"intent": "add_task", "confidence": 0.95, "parameters": {"title": "call dentist for appointment"}}
- "I need to finish the report" -> {"intent": "add_task", "confidence": 0.85, "parameters": {"title": "finish the report"}}
- "do that thing" -> {"intent": "unclear", "confidence": 0.3, "parameters": {}}
- "Create a task" -> {"intent": "unclear", "confidence": 0.5, "parameters": {}}

If the intent is unclear or ambiguous, set confidence < 0.7 and intent to "unclear".
"""

    def parse_intent(self, user_message: str, language: Literal["en", "ur"] = "en") -> Dict:
        """
        Parse user message to extract intent and parameters.

        For User Story 1 (add_task only), this is a simplified rule-based parser.
        In production, this would use an LLM or ML model.

        Args:
            user_message: User's natural language message
            language: Language of the message ("en" for English, "ur" for Urdu)

        Returns:
            dict: Intent classification with confidence and parameters
        """
        message_lower = user_message.lower().strip()

        # Get language-specific keywords
        keywords = self._get_keywords_for_language(language)
        
        add_task_keywords = keywords.get("add_task", [])
        list_tasks_keywords = keywords.get("list_tasks", [])
        complete_task_keywords = keywords.get("complete_task", [])
        update_task_keywords = keywords.get("update_task", [])
        delete_task_keywords = keywords.get("delete_task", [])
        greeting_keywords = keywords.get("greeting", [])
        gratitude_keywords = keywords.get("gratitude", [])
        capabilities_keywords = keywords.get("capabilities", [])

        # Check for add_task intent
        has_add_keyword = any(keyword in message_lower for keyword in add_task_keywords)

        # Check for list_tasks intent
        has_list_keyword = any(keyword in message_lower for keyword in list_tasks_keywords)

        # Check for complete_task intent
        has_complete_keyword = any(keyword in message_lower for keyword in complete_task_keywords)

        # Check for update_task intent
        has_update_keyword = any(keyword in message_lower for keyword in update_task_keywords)

        # Check for delete_task intent
        has_delete_keyword = any(keyword in message_lower for keyword in delete_task_keywords)

        # Check for conversational intents
        is_greeting = any(keyword in message_lower for keyword in greeting_keywords)
        is_gratitude = any(keyword in message_lower for keyword in gratitude_keywords)
        is_capabilities_query = any(keyword in message_lower for keyword in capabilities_keywords)

        # Check for vague/unclear requests
        vague_phrases = ["that thing", "the thing", "something", "stuff"]
        is_vague = any(phrase in message_lower for phrase in vague_phrases)

        # Check for contextual references
        contextual_references = [
            "that task",
            "that one",
            "this task",
            "this one",
            "the last one",
            "the recent one",
            "the one i just",
            "it",
        ]
        has_contextual_reference = any(
            ref in message_lower for ref in contextual_references
        )

        # Empty or too short
        if len(message_lower) < 3:
            return {
                "intent": "unclear",
                "confidence": 0.2,
                "parameters": {},
                "reason": "Message too short",
            }

        # Vague request without specifics
        if is_vague or message_lower in ["create a task", "add a task", "new task"]:
            return {
                "intent": "unclear",
                "confidence": 0.4,
                "parameters": {},
                "reason": "Ambiguous - missing task details",
            }

        # Check for conversational intents (high priority for user experience)
        if is_greeting:
            return {
                "intent": "conversational",
                "confidence": 0.95,
                "parameters": {"conversation_type": "greeting"},
            }

        if is_gratitude:
            return {
                "intent": "conversational",
                "confidence": 0.95,
                "parameters": {"conversation_type": "gratitude"},
            }

        if is_capabilities_query:
            return {
                "intent": "conversational",
                "confidence": 0.9,
                "parameters": {"conversation_type": "capabilities"},
            }

        # Check for delete_task intent (highest priority for task operations - destructive action)
        if has_delete_keyword:
            # Extract task ID
            task_id = self._extract_task_id(message_lower)

            # Check for contextual reference without concrete task ID
            if has_contextual_reference and not task_id:
                return {
                    "intent": "unclear",
                    "confidence": 0.5,
                    "parameters": {},
                    "reason": "Which task would you like to delete? Please specify the task number (e.g., 'task 5')",
                }

            if not task_id:
                return {
                    "intent": "unclear",
                    "confidence": 0.4,
                    "parameters": {},
                    "reason": "Cannot identify which task to delete",
                }

            return {
                "intent": "delete_task",
                "confidence": 0.9,
                "parameters": {"task_id": task_id},
            }

        # Check for update_task intent (high priority for modifications)
        if has_update_keyword:
            # Extract task ID
            task_id = self._extract_task_id(message_lower)

            # Extract new title and/or description
            update_params = self._extract_update_parameters(user_message, message_lower)

            # Check for contextual reference without concrete task ID
            if (
                has_contextual_reference
                and not task_id
                and not update_params.get("task_id")
            ):
                return {
                    "intent": "unclear",
                    "confidence": 0.5,
                    "parameters": {},
                    "reason": "Which task would you like to update? Please specify the task number (e.g., 'task 5')",
                }

            if not task_id and not update_params.get("task_id"):
                return {
                    "intent": "unclear",
                    "confidence": 0.4,
                    "parameters": {},
                    "reason": "Cannot identify which task to update",
                }

            if not update_params.get("title") and not update_params.get("description"):
                return {
                    "intent": "unclear",
                    "confidence": 0.4,
                    "parameters": {},
                    "reason": "Cannot determine what to update",
                }

            return {
                "intent": "update_task",
                "confidence": 0.9,
                "parameters": {
                    "task_id": task_id or update_params.get("task_id"),
                    "title": update_params.get("title"),
                    "description": update_params.get("description"),
                },
            }

        # Check for complete_task intent (high priority for status changes)
        if has_complete_keyword:
            # Extract task ID or title
            task_id = self._extract_task_id(message_lower)
            task_title = self._extract_task_title_for_completion(message_lower)

            # Check for contextual reference without concrete task ID
            if has_contextual_reference and not task_id and not task_title:
                return {
                    "intent": "unclear",
                    "confidence": 0.5,
                    "parameters": {},
                    "reason": "Which task would you like to mark as complete? Please specify the task number (e.g., 'task 5')",
                }

            if not task_id and not task_title:
                return {
                    "intent": "unclear",
                    "confidence": 0.4,
                    "parameters": {},
                    "reason": "Cannot identify which task to complete",
                }

            return {
                "intent": "complete_task",
                "confidence": 0.9,
                "parameters": {"task_id": task_id, "task_title": task_title},
            }

        # Check for list_tasks intent (takes priority over add_task)
        if has_list_keyword:
            # Extract status filter
            status = self._extract_status_filter(message_lower)

            return {
                "intent": "list_tasks",
                "confidence": 0.9,
                "parameters": {"status": status},
            }

        # Likely add_task intent
        if has_add_keyword or self._looks_like_task_description(message_lower):
            # Extract title
            title = self._extract_title(user_message)

            if not title or len(title.strip()) < 2:
                return {
                    "intent": "unclear",
                    "confidence": 0.5,
                    "parameters": {},
                    "reason": "Cannot extract meaningful task title",
                }

            return {
                "intent": "add_task",
                "confidence": 0.9 if has_add_keyword else 0.75,
                "parameters": {"title": title, "description": None},
            }

        # Default: unclear
        return {
            "intent": "unclear",
            "confidence": 0.3,
            "parameters": {},
            "reason": "Intent not recognized",
        }

    def _extract_status_filter(self, message: str) -> str:
        """Extract status filter from message"""
        if "pending" in message or "active" in message or "current" in message:
            return "pending"
        elif "completed" in message and ("show" in message or "what" in message):
            # Only treat as filter if in context of viewing tasks
            return "completed"
        else:
            return "all"

    def _extract_task_id(self, message: str) -> Optional[int]:
        """Extract task ID from message (e.g., 'task #5', 'task 5')"""
        import re

        # Look for patterns like "#5", "task 5", "task #5", "number 5"
        patterns = [
            r"#(\d+)",  # #5
            r"task\s+#?(\d+)",  # task 5, task #5
            r"number\s+(\d+)",  # number 5
            r"id\s+(\d+)",  # id 5
        ]

        for pattern in patterns:
            match = re.search(pattern, message)
            if match:
                return int(match.group(1))

        return None

    def _extract_task_title_for_completion(self, message: str) -> Optional[str]:
        """Extract task title when user references it by name"""
        # Remove completion keywords to get the task reference
        keywords_to_remove = [
            "i finished ",
            "i completed ",
            "i did ",
            "complete ",
            "finish ",
            "done with ",
            "mark as done ",
            "mark complete ",
        ]

        cleaned = message
        for keyword in keywords_to_remove:
            cleaned = cleaned.replace(keyword, "")

        cleaned = cleaned.strip()

        # If there's meaningful text left, it might be a task title reference
        if len(cleaned) > 2 and not self._extract_task_id(message):
            return cleaned

        return None

    def _looks_like_task_description(self, message: str) -> bool:
        """Check if message looks like a task description"""
        # Common action verbs
        action_verbs = [
            "buy",
            "call",
            "email",
            "write",
            "finish",
            "complete",
            "send",
            "schedule",
            "book",
            "pay",
            "fix",
            "clean",
            "organize",
            "prepare",
            "review",
            "submit",
        ]

        return any(verb in message for verb in action_verbs)

    def _extract_title(self, message: str) -> Optional[str]:
        """Extract task title from message"""
        message = message.strip()

        # Remove common prefixes
        prefixes_to_remove = [
            "remind me to ",
            "i need to ",
            "i have to ",
            "i should ",
            "add task: ",
            "add task ",
            "create task: ",
            "create task ",
            "new task: ",
            "new task ",
            "task: ",
            "todo: ",
        ]

        message_lower = message.lower()
        for prefix in prefixes_to_remove:
            if message_lower.startswith(prefix):
                # Preserve original case for title
                return message[len(prefix) :].strip()

        # If no prefix matched, return the whole message as title
        return message

    def _extract_update_parameters(
        self, message: str, message_lower: str
    ) -> Dict[str, any]:
        """Extract new title and/or description from update request"""
        import re

        result = {}

        # Pattern 1: "change/update/modify task X to Y"
        # Example: "change task 5 to buy milk"
        pattern1 = r"(?:change|update|modify|edit|rename)\s+(?:task\s+)?[#]?(\d+)\s+(?:to|into)\s+(.+)"
        match1 = re.search(pattern1, message_lower)
        if match1:
            result["task_id"] = int(match1.group(1))
            result["title"] = message[match1.start(2) : match1.end(2)].strip()
            return result

        # Pattern 2: "change/update task X title to Y"
        # Example: "update task #3 title to call dentist"
        pattern2 = r"(?:change|update|modify|edit)\s+(?:task\s+)?[#]?(\d+)\s+title\s+(?:to|into)\s+(.+)"
        match2 = re.search(pattern2, message_lower)
        if match2:
            result["task_id"] = int(match2.group(1))
            result["title"] = message[match2.start(2) : match2.end(2)].strip()
            return result

        # Pattern 3: "change/update task X description to Y"
        # Example: "change task 1 description to urgent project"
        pattern3 = r"(?:change|update|modify|edit)\s+(?:task\s+)?[#]?(\d+)\s+description\s+(?:to|into)\s+(.+)"
        match3 = re.search(pattern3, message_lower)
        if match3:
            result["task_id"] = int(match3.group(1))
            result["description"] = message[match3.start(2) : match3.end(2)].strip()
            return result

        # Pattern 4: "rename task X to Y" (implies title change)
        # Example: "rename task 2 to finish the report"
        pattern4 = r"rename\s+(?:task\s+)?[#]?(\d+)\s+(?:to|into)\s+(.+)"
        match4 = re.search(pattern4, message_lower)
        if match4:
            result["task_id"] = int(match4.group(1))
            result["title"] = message[match4.start(2) : match4.end(2)].strip()
            return result

        return result
    def _get_keywords_for_language(self, language: str) -> Dict[str, list]:
        """Get intent keywords for the specified language"""
        if language == "ur":
            # Urdu keywords (Romanized/transliterated for regex matching)
            return {
                "add_task": ["yaad dilana", "task shamil", "kaam shamil", "task add", "mujhe yaad", "mujhe karna"],
                "list_tasks": ["dikha", "dikhayen", "batao", "mere tasks", "kya pending", "kya kaam"],
                "complete_task": ["mukammal", "mukammil", "poora kiya", "puri hui", "khatam"],
                "update_task": ["badlao", "update", "change", "tabdeel"],
                "delete_task": ["delete", "hata", "remove"],
                "greeting": ["aslam", "hello", "hi", "kya haal"],
                "gratitude": ["shukriya", "thanks", "thank you"],
                "capabilities": ["kya kar sakte", "muddad", "features"],
            }
        else:
            # English keywords (default)
            return {
                "add_task": [
                    "remind",
                    "add task",
                    "create task",
                    "new task",
                    "i need to",
                    "i have to",
                    "i should",
                    "todo:",
                    "task:",
                ],
                "list_tasks": [
                    "show",
                    "list",
                    "view",
                    "see",
                    "what's",
                    "what are",
                    "my tasks",
                ],
                "complete_task": [
                    "complete",
                    "finish",
                    "finished",
                    "done",
                    "mark as done",
                    "mark complete",
                    "i finished",
                    "i completed",
                    "i did",
                ],
                "update_task": [
                    "update",
                    "change",
                    "modify",
                    "edit",
                    "rename",
                    "revise",
                ],
                "delete_task": [
                    "delete",
                    "remove",
                    "cancel",
                    "discard",
                    "get rid of",
                    "throw away",
                ],
                "greeting": ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
                "gratitude": ["thanks", "thank you", "appreciate", "grateful"],
                "capabilities": ["what can you do", "help", "capabilities", "features", "how to use"],
            }