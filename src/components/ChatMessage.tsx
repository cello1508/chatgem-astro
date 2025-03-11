
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Lock, Unlock } from 'lucide-react';
import { MessageType } from '@/types/chat';
import { Button } from './ui/button';

interface ChatMessageProps {
  message: MessageType;
  isLast?: boolean;
  isEncrypted?: boolean;
  onDecrypt?: () => Promise<MessageType>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isLast = false,
  isEncrypted = false,
  onDecrypt
}) => {
  const isAssistant = message.role === 'assistant';
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);

  const handleDecrypt = async () => {
    if (!onDecrypt) return;

    setIsDecrypting(true);
    try {
      const decryptedMessage = await onDecrypt();
      setDecryptedContent(decryptedMessage.content);
    } catch (error) {
      console.error('Erro ao descriptografar mensagem:', error);
    } finally {
      setIsDecrypting(false);
    }
  };

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
                
                {isEncrypted && !decryptedContent && (
                  <span className="ml-2 inline-flex items-center">
                    <Lock size={14} className="text-amber-500 mr-1" />
                    <span className="text-amber-500 text-xs">Criptografado</span>
                  </span>
                )}
                
                {isEncrypted && decryptedContent && (
                  <span className="ml-2 inline-flex items-center">
                    <Unlock size={14} className="text-green-500 mr-1" />
                    <span className="text-green-500 text-xs">Descriptografado</span>
                  </span>
                )}
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
              {isEncrypted ? (
                decryptedContent ? (
                  decryptedContent
                ) : (
                  <div className="space-y-2">
                    <p className="text-amber-500">
                      Esta mensagem está criptografada.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDecrypt}
                      disabled={isDecrypting}
                      className="flex items-center gap-2"
                    >
                      <Unlock size={14} />
                      {isDecrypting ? "Descriptografando..." : "Descriptografar"}
                    </Button>
                  </div>
                )
              ) : (
                message.content
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
