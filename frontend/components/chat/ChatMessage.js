import { memo } from 'react';

/**
 * ChatMessage Component
 *
 * Renders a message bubble in the chat interface.
 * Displays different styling for user vs assistant messages.
 */

const ChatMessage = memo(function ChatMessage({ role, content }) {
  // Determine alignment and styling based on role
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <div
      className={`flex w-full mb-5 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'
        }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-[22px] px-4.5 py-3 shadow-2xl relative group transition-all duration-500 ${isUser
            ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-br-none shadow-brand-500/20'
            : 'glass-panel border border-white/10 text-white/90 rounded-bl-none shadow-black/10'
          }`}
      >
        {/* Message content */}
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap select-text font-medium tracking-tight">
          {content}
        </p>

        {/* Subtle timestamp and status area */}
        <div className={`flex items-center mt-2.5 space-x-1.5 opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[9px] font-bold tracking-widest uppercase">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Role indicator (optional, for accessibility) */}
        <span className="sr-only">
          {isUser ? 'Your message' : 'Assistant message'}
        </span>
      </div>
    </div>
  );
});

export default ChatMessage;
