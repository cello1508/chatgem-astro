
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Dispatch custom event when a message is sent
      const messageSentEvent = new Event('messageSent');
      window.dispatchEvent(messageSentEvent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="relative max-w-3xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-input rounded-xl overflow-hidden transition-all focus-within:border-success/50 focus-within:shadow-[0_0_10px_rgba(56,215,132,0.15)]">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva uma mensagem..."
              disabled={disabled}
              className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-gray-100 focus:outline-none placeholder:text-gray-500 disabled:opacity-50 max-h-[200px] min-h-[56px]"
              rows={1}
            />
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`absolute right-2 bottom-2.5 p-1.5 rounded-lg transition-all ${
                message.trim() && !disabled
                  ? 'bg-success text-black'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Este é um assistente de simulação. Respostas são fictícias.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
