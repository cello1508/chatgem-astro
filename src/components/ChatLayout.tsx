
import React from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageType } from '@/types/chat';

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = React.useState(!isMobile);
  const [messages, setMessages] = React.useState<MessageType[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Como posso ajudar você hoje?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate assistant typing
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Recebi sua mensagem: "${content}". Como posso continuar te ajudando?`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0F0F0F]">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out lg:relative ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar onClose={() => setShowSidebar(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col w-full">
        {/* Toggle sidebar button (mobile only) */}
        {isMobile && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed top-4 left-4 z-30 p-2 rounded-md bg-[#171717]/80 border border-gray-800 lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        
        {/* Chat interface */}
        <div className="flex flex-col h-full">
          {/* Messages container */}
          <MessageList messages={messages} isTyping={isTyping} />
          
          {/* Input area */}
          <div className="p-4 pb-6 w-full">
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
