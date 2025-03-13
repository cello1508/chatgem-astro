
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useSubscription } from '@/hooks/use-subscription';
import { useDocumentLock } from '@/hooks/use-document-lock';
import { ChatHeader } from './ChatHeader';
import PasswordDialog from './PasswordDialog';

export function ChatLayout() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Olá! Como posso ajudar você hoje?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);
  
  const {
    isPremium,
    isLoadingSubscription,
    handleSubscribe
  } = useSubscription();
  
  const {
    isLocked,
    showPasswordDialog,
    setShowPasswordDialog,
    handleLock,
    handleUnlock
  } = useDocumentLock();

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: "user", content: message },
    ];
    setMessages(newMessages);
    
    // In a real app, you would send the message to an API here
    setLoading(true);
    setIsTyping(true);
    
    // Simulate API delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Você enviou: "${message}". Esta é uma resposta simulada.`,
        },
      ]);
      setLoading(false);
      setIsTyping(false);
    }, 1000);
  };

  const handleCloseMenu = () => {
    // Placeholder function for Sidebar onClose prop
    console.log("Sidebar closed");
  };

  const handleChangeSection = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onClose={handleCloseMenu} 
        onChangeSection={handleChangeSection}
        activeSection={activeSection}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          isPremium={isPremium}
          isLoadingSubscription={isLoadingSubscription}
          handleSubscribe={handleSubscribe}
          handleLock={handleLock}
          isLocked={isLocked}
        />
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList 
            messages={messages} 
            isTyping={isTyping}
          />
          <ChatInput onSendMessage={handleSendMessage} disabled={loading || isLocked} />
        </div>
      </div>
      
      {showPasswordDialog && (
        <PasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  );
}
