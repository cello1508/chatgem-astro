
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { MessageType } from '@/types/chat';

interface ChatMessageProps {
  message: MessageType;
  isLast?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast = false }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        "py-6 px-4 md:px-8 w-full animate-fade-in",
        isAssistant ? "bg-transparent" : "bg-[#121212]"
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          {/* Avatar */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isAssistant ? "bg-success/10 text-success" : "bg-gray-700"
          )}>
            {isAssistant ? (
              isLast ? (
                <div className="success-icon">
                  <Check size={16} />
                </div>
              ) : (
                <span className="text-sm font-semibold">AI</span>
              )
            ) : (
              <span className="text-sm font-semibold">Você</span>
            )}
          </div>

          {/* Message content */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <h3 className="font-medium text-sm text-gray-300">
                {isAssistant ? 'Assistente' : 'Você'}
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
