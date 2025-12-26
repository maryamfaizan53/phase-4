"""Language detection module for Todo AI Chatbot

Detects whether user input is in English or Urdu based on character analysis.
"""

from typing import Literal


def detect_language(text: str) -> Literal["en", "ur"]:
    """
    Detect language of input text (English or Urdu).
    
    Uses character frequency analysis:
    - Urdu: Unicode range 0600-06FF (Arabic/Urdu script)
    - English: ASCII alphanumeric
    
    Args:
        text: Input text to analyze
        
    Returns:
        "ur" if Urdu detected (≥20% Urdu characters)
        "en" otherwise (English/mixed default)
    """
    if not text or len(text) < 2:
        return "en"
    
    # Count Urdu Unicode characters (0600-06FF range)
    urdu_count = sum(1 for char in text if 0x0600 <= ord(char) <= 0x06FF)
    
    # If more than 20% of characters are Urdu, classify as Urdu
    urdu_percentage = (urdu_count / len(text)) * 100
    
    return "ur" if urdu_percentage >= 20 else "en"


def get_language_name(lang: str) -> str:
    """Get display name for language code."""
    return "Urdu" if lang == "ur" else "English"
