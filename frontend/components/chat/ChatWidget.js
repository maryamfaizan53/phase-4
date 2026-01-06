/**
 * ChatWidget Component
 *
 * Floating chat widget with text and voice input.
 * Allows users to interact with the AI assistant for task management.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../../lib/api';
import ChatMessage from './ChatMessage';
import VoiceInputButton from './VoiceInputButton';

export default function ChatWidget({ userId, onTaskUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Hello! I can help you manage your tasks. Try saying "list my tasks" or "add a new task".',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call chat API
      const response = await chatAPI.sendMessage(userId, message);

      // Add assistant response
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || 'I apologize, I couldn\'t process that request.',
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Trigger dashboard refresh if task was modified
      if (onTaskUpdate) {
        setTimeout(() => onTaskUpdate(), 500);
      }
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    // Auto-submit after voice input
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  // Toggle widget open/close
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Closed State: Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition-all hover:scale-110"
          aria-label="Open chat"
        >
          {/* Chat Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Open State: Chat Window */}
      {isOpen && (
        <div
          className="flex flex-col w-full sm:w-96 h-[90vh] sm:h-[500px] glass-card rounded-xl shadow-2xl overflow-hidden animate-pop-in fixed sm:relative inset-x-0 bottom-0 sm:inset-auto"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-brand-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase">AI Task Agent</h3>
                <p className="text-[10px] text-brand-200 font-medium opacity-80">Online & Ready to Help</p>
              </div>
            </div>

            <button
              onClick={toggleWidget}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {/* Loading Indicator (Typing Dots) */}
            {loading && (
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="bg-white/5 backdrop-blur-md border-t border-white/10 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="flex-1 relative group">
                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me to add, delete or edit tasks..."
                  className="w-full glass-input rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50 transition-all placeholder:text-white/30"
                  disabled={loading}
                />

                {/* Subtle Voice Trigger overlay indicator or similar could go here */}
              </div>

              {/* Voice Input Button */}
              <div className="flex-shrink-0">
                <VoiceInputButton onTranscript={handleVoiceTranscript} />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}
