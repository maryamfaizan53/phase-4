import { memo } from 'react';

/**
 * Elite ChatMessage Component
 */

const ChatMessage = memo(function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex w-full mb-6 animate-reveal ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-[2.5rem] px-6 py-4 shadow-premium relative group transition-all duration-500 overflow-hidden ${isUser
            ? 'bg-gradient-to-br from-brand-500 via-brand-600 to-brand-secondary text-black rounded-br-none shadow-brand-500/20'
            : 'glass-panel border-white/10 text-white rounded-bl-none'
          }`}
      >
        {/* Decorative elements for user messages */}
        {isUser && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
        )}

        <p className="text-[15px] leading-relaxed whitespace-pre-wrap select-text font-semibold tracking-tight relative z-10">
          {content}
        </p>

        <div className={`flex items-center mt-3 space-x-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500 relative z-10 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[10px] font-black tracking-widest uppercase ${isUser ? 'text-black' : 'text-brand-300'}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <span className="sr-only">
          {isUser ? 'Your message' : 'Assistant message'}
        </span>
      </div>
    </div>
  );
});

export default ChatMessage;
