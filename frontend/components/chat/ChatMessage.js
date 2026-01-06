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
      className={`flex w-full mb-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'
        }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${isUser
          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-none shadow-brand-500/10'
          : 'glass-panel border border-white/10 text-white rounded-bl-none shadow-black/5'
          }`}
      >
        {/* Message content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap select-text">
          {content}
        </p>

        {/* Subtle timestamp */}
        <div className={`text-[10px] mt-1.5 opacity-40 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
