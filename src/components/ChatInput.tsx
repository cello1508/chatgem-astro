
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface ChatInputProps {
  onSendMessage: (message: string, modelId?: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Histórico de conversas
  const conversations = [
    { id: '1', title: 'Conversa anterior 1', date: '12 Jun' },
    { id: '2', title: 'Ajuda com código React', date: '10 Jun' },
    { id: '3', title: 'Ideias para novo projeto', date: '8 Jun' },
  ];

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

  const handleMouseEnter = () => {
    // Don't start the hover timer if already expanded
    if (isExpanded) return;
    
    // Start the hover timer when mouse enters
    setIsHolding(true);
    setHoldProgress(0);
    
    holdTimerRef.current = setInterval(() => {
      setHoldProgress(prev => {
        // 100% in 1.5 seconds (15 steps of 100ms)
        const newProgress = prev + (100 / 15);
        
        if (newProgress >= 100) {
          // Clear the interval when we reach 100%
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          
          // Expand after 1.5 seconds
          setIsExpanded(true);
          setIsHolding(false);
          return 0;
        }
        
        return newProgress;
      });
    }, 100);
  };

  const handleMouseLeave = () => {
    // Cancel the timer when mouse leaves
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  // Handle clicking outside to close the expanded panel
  const handleClosePanel = () => {
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    // When already expanded, just close it
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      // When not expanded, toggle to expand it
      setIsExpanded(true);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
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
                className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-gray-100 focus:outline-none placeholder:text-gray-500 disabled:opacity-50 max-h-[200px] min-h-[56px]"
                rows={1}
              />
              <div className="absolute right-12 bottom-3">
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
        
        <CollapsibleContent className="glass rounded-xl p-3 mt-3 border border-gray-800/50 overflow-hidden transition-all duration-700 ease-in-out animate-accordion-down transform origin-top">
          {/* New chat button */}
          <button className="w-full bg-success/10 text-success rounded-lg p-3 flex items-center gap-2 hover:bg-success/20 transition-all mb-3 transform hover:scale-[1.02] active:scale-100 duration-300 animate-slide-in">
            <Plus size={18} />
            <span>Nova conversa</span>
          </button>
          
          {/* Conversation history */}
          <div className="space-y-1 max-h-[200px] overflow-y-auto animate-fade-in" style={{ animationDelay: "50ms" }}>
            <h3 className="text-sm text-gray-400 mb-2 px-2">Histórico de conversas</h3>
            <div className="space-y-1">
              {conversations.map((convo, index) => (
                <button
                  key={convo.id}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-gray-700/30 flex items-start gap-2 transition-all transform hover:translate-x-1 hover:bg-gray-700/50 duration-300 animate-slide-in"
                  onClick={handleClosePanel}
                  style={{ animationDelay: `${(index + 1) * 75}ms` }}
                >
                  <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{convo.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{convo.date}</p>
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
