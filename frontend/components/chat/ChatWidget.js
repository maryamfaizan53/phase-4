/**
 * Elite ChatWidget Component with Cinematic UI
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
      content: 'Greetings. I am your Neural Task Assistant. How shall we optimize your productivity today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userId, message);

      const assistantMessage = {
        id: `ast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response.response || 'System bypass detected. Unable to synthesize response.',
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (onTaskUpdate) {
        setTimeout(() => onTaskUpdate(), 500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: 'Connection interrupted. Please re-synchronize with the neural link.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const clearChat = () => {
    if (window.confirm('Erase conversation history from neural buffers?')) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: 'Buffers cleared. Ready for new instructions.',
        },
      ]);
    }
  };

  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
      {/* Premium Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-neon hover:shadow-neon-hover transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden"
          aria-label="Initialize Assistant"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Cinematic Chat Window */}
      {isOpen && (
        <div
          className="flex flex-col w-full sm:w-[450px] h-[90vh] sm:h-[650px] glass-card rounded-[3rem] shadow-premium overflow-hidden animate-reveal fixed sm:relative inset-x-0 bottom-0 sm:inset-auto border-white/5"
          style={{ maxHeight: 'calc(100vh - 4rem)' }}
        >
          {/* Elite Header */}
          <div className="px-8 py-8 bg-black/40 backdrop-blur-3xl flex items-center justify-between border-b border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-50"></div>

            <div className="flex items-center gap-5 relative z-10">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-black"
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
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-400 rounded-full border-4 border-black group-hover:animate-ping"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">Neural Assistant</h3>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
                  <span className="text-[10px] text-brand-300 font-bold uppercase tracking-[0.2em] opacity-80">Synchronization Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button
                onClick={clearChat}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                title="Purge Buffers"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                onClick={toggleWidget}
                className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all border border-white/5"
                aria-label="Terminate Link"
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 scrollbar-custom">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {loading && (
              <div className="flex items-center gap-3 px-6 py-4 glass-panel inline-flex rounded-3xl animate-reveal border-white/5">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                <span className="text-xs font-bold text-brand-300 uppercase tracking-widest ml-2">Processing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="px-8 py-8 bg-black/40 backdrop-blur-3xl border-t border-white/5 relative">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            >
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-brand-secondary rounded-[2.5rem] opacity-0 group-focus-within:opacity-20 transition duration-500 blur"></div>

                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  onChange={(e) => {
                    setInput(e.target.value);
                    adjustTextareaHeight(e);
                  }}
                  placeholder="Transmit new instructions..."
                  className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-5 text-[15px] text-white focus:outline-none transition-all placeholder:text-white/20 resize-none min-h-[60px] max-h-[160px] relative z-10 font-medium focus:bg-white/10"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-3 pb-1 relative z-10">
                <VoiceInputButton onTranscript={handleVoiceTranscript} />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center w-14 h-14 rounded-[1.5rem] bg-brand-500 text-black disabled:opacity-20 disabled:grayscale transition-all hover:scale-110 active:scale-90 shadow-neon group"
                  aria-label="Execute Command"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
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

      {/* Cinematic Styles */}
      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .scrollbar-custom:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
