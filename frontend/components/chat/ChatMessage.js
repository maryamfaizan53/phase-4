/**
 * ChatMessage Component
 *
 * Renders a message bubble in the chat interface.
 * Displays different styling for user vs assistant messages.
 */

export default function ChatMessage({ role, content }) {
  // Determine alignment and styling based on role
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <div
      className={`flex w-full mb-4 animate-slide-up ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-brand-500 text-white rounded-br-none'
            : 'glass-panel border border-white/20 text-white rounded-bl-none'
        }`}
      >
        {/* Message content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap select-text">
          {content}
        </p>

        {/* Role indicator (optional, for accessibility) */}
        <span className="sr-only">
          {isUser ? 'Your message' : 'Assistant message'}
        </span>
      </div>
    </div>
  );
}
