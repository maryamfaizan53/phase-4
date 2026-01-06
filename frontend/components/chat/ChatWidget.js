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
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        id: `ast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

  // Clear chat history
  const clearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: 'Hello! I can help you manage your tasks. Try saying "list my tasks" or "add a new task".',
        },
      ]);
    }
  };

  // Auto-expand textarea
  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
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
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-600 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide uppercase text-white/90">Task Assistant</h3>
                <p className="text-[10px] text-brand-300 font-semibold tracking-wider opacity-90 uppercase">System Online</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors group relative"
                title="Clear Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                onClick={toggleWidget}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
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

          {/* Input Form Area */}
          <div className="bg-black/20 backdrop-blur-2xl border-t border-white/5 p-4 sm:p-5 relative">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <form
              onSubmit={handleSubmit}
              className="flex items-end space-x-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              <div className="flex-1 relative group bg-black/40 rounded-[20px] transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-500/30 overflow-hidden shadow-inner">
                {/* Auto-expanding Textarea */}
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustTextareaHeight(e);
                  }}
                  placeholder="Message Task Assistant..."
                  className="w-full bg-transparent border-none rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-white/20 resize-none min-h-[48px] max-h-[140px] scrollbar-thin overflow-y-auto leading-relaxed"
                  disabled={loading}
                  style={{ height: '48px' }}
                />
              </div>

              {/* Action Buttons Section */}
              <div className="flex items-center space-x-2 pb-0.5">
                {/* Voice Input Button */}
                <div className="flex-shrink-0">
                  <VoiceInputButton onTranscript={handleVoiceTranscript} />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-[16px] bg-gradient-to-br from-brand-400 to-brand-600 text-white disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-xl shadow-brand-500/20 active:scale-90 hover:brightness-110"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 drop-shadow-md"
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15);
        }

        /* Glass Scrollbar for Message Container */
        .flex-1.overflow-y-auto::-webkit-scrollbar {
          width: 5px;
        }
        .flex-1.overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .flex-1.overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .flex-1.overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
