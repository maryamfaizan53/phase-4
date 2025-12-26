/**
 * VoiceInputButton Component
 *
 * Microphone button that triggers voice input using Web Speech API.
 * Only renders in supported browsers (Chrome, Edge).
 */

'use client';

import { useEffect } from 'react';
import { useVoiceInput } from '../../hooks/useVoiceInput';

export default function VoiceInputButton({ onTranscript }) {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
  } = useVoiceInput();

  // Call onTranscript when transcript updates
  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  // Don't render if voice input is not supported
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 cursor-not-allowed'
          : 'bg-brand-500 hover:bg-brand-600'
      }`}
      aria-label={isListening ? 'Listening...' : 'Start voice input'}
      title={isListening ? 'Listening...' : 'Click to speak'}
    >
      {/* Microphone Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>

      {/* Pulse animation when listening */}
      {isListening && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse-ring" />
      )}
    </button>
  );
}
