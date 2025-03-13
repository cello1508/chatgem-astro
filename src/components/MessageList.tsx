
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { MessageType } from '@/types/chat';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  conversationId?: string;
  needsDecryption?: boolean;
  onDecryptMessage?: (message: MessageType) => Promise<MessageType>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping, 
  conversationId,
  needsDecryption,
  onDecryptMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="pb-20 pt-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id || index} 
            message={message}
            isLast={index === messages.length - 1 && message.role === 'assistant'} 
            isEncrypted={needsDecryption && message.content === 'ENCRYPTED_CONTENT'}
            onDecrypt={needsDecryption && onDecryptMessage ? () => onDecryptMessage(message) : undefined}
          />
        ))}
        
        {isTyping && (
          <div className="py-6 px-4 md:px-8 w-full">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                {/* Avatar for typing indicator */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10 animate-pulse">
                  <span className="text-sm font-semibold text-success">AI</span>
                </div>
                
                {/* Typing indicator */}
                <div className="flex-1">
                  <div className="h-6 flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-success animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-success animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
