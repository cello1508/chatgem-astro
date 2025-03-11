
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, ChevronUp, ChevronDown, MessageSquare, Lock, Unlock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { webhookService } from '@/services/webhookService';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (message: string, modelId?: string) => void;
  disabled?: boolean;
  conversationId?: string;
  onNewConversation?: () => void;
  onSelectConversation?: (id: string) => void;
  conversations?: any[];
  isEncrypted?: boolean;
  onEncryptToggle?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  conversationId,
  onNewConversation,
  onSelectConversation,
  conversations = [],
  isEncrypted = false,
  onEncryptToggle
}) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
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

  const handleMouseEnter = () => {
    if (isExpanded) return;
    
    setIsHolding(true);
    setHoldProgress(0);
    
    holdTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        const newProgress = prev + (100 / 30);
        
        if (newProgress >= 100) {
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          
          setIsExpanded(true);
          setIsHolding(false);
          return 0;
        }
        
        return newProgress;
      });
    }, 100);
  };

  const handleMouseLeave = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleClosePanel = () => {
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleNewConversation = () => {
    if (onNewConversation) {
      onNewConversation();
      handleClosePanel();
    }
  };

  const handleSelectConversation = (id: string) => {
    if (onSelectConversation) {
      onSelectConversation(id);
      handleClosePanel();
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="relative max-w-3xl mx-auto w-full">
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full mb-4"
      >
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
                className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-gray-100 focus:outline-none placeholder:text-gray-500 disabled:opacity-50 max-h-[200px] min-h-[56px]"
                rows={1}
              />
              <div className="absolute right-12 bottom-3 flex gap-1">
                {onEncryptToggle && (
                  <button
                    type="button"
                    className="p-1.5 rounded-lg transition-all hover:bg-gray-700/30"
                    title={isEncrypted ? "Desativar criptografia" : "Ativar criptografia"}
                    onClick={onEncryptToggle}
                  >
                    {isEncrypted ? <Lock size={18} className="text-amber-500" /> : <Unlock size={18} />}
                  </button>
                )}
                <div 
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    className="p-1.5 rounded-lg transition-all hover:bg-gray-700/30"
                    title={isExpanded ? "Esconder opções" : "Mostrar opções"}
                    onClick={handleToggleExpand}
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                  
                  {isHolding && !isExpanded && (
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 transition-all"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="#38D784" 
                        fill="none" 
                        strokeWidth="2"
                        strokeDasharray={`${holdProgress * 0.63} 100`}
                        transform="rotate(-90 12 12)"
                        className="transition-all duration-100 ease-linear"
                      />
                    </svg>
                  )}
                </div>
              </div>
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
        
        <CollapsibleContent 
          className="glass rounded-xl p-3 mt-3 border border-gray-800/50 overflow-hidden transition-all duration-[5000ms] ease-[cubic-bezier(0.16,1,0.3,1)] animate-accordion-down transform origin-top"
        >
          <button 
            className="w-full bg-success/10 text-success rounded-lg p-3 flex items-center gap-2 hover:bg-success/20 transition-all mb-3 transform hover:scale-[1.02] active:scale-100 duration-500 animate-slide-in" 
            style={{ animationDuration: '3s', animationDelay: '0.8s', transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={handleNewConversation}
          >
            <Plus size={18} />
            <span>Nova conversa</span>
          </button>
          
          <div 
            className="space-y-1 max-h-[200px] overflow-y-auto animate-fade-in" 
            style={{ animationDuration: '3.5s', animationDelay: "1.2s" }}
          >
            <h3 
              className="text-sm text-gray-400 mb-2 px-2 animate-fade-in" 
              style={{ animationDuration: '3s', animationDelay: "1.5s" }}
            >
              Histórico de conversas
            </h3>
            <div className="space-y-1">
              {conversations.map((convo, index) => (
                <button
                  key={convo.id}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-gray-700/30 flex items-start gap-2 transition-all transform hover:translate-x-1 hover:bg-gray-700/50 duration-500 animate-slide-in"
                  onClick={() => handleSelectConversation(convo.id)}
                  style={{ 
                    animationDuration: '3s',
                    animationDelay: `${2 + (index * 0.2)}s`,
                    transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                    <MessageSquare size={16} />
                    {convo.is_encrypted && <Lock size={12} className="text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{convo.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(convo.updated_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChatInput;
