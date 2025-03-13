
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import CalendarSection from './CalendarSection';
import PomodoroSection from './PomodoroSection';
import LowCodeNewsSection from './LowCodeNewsSection';
import PasswordDialog from './PasswordDialog';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConversations } from '@/hooks/use-conversations';
import { useChatMessaging } from '@/hooks/use-chat-messaging';

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState('chat');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);
  
  const {
    conversations,
    currentConversationId,
    isEncrypted,
    chatPassword,
    isLoadingConversation,
    messages,
    setMessages,
    setCurrentConversationId,
    loadConversations,
    loadMessages,
    handleNewConversation,
    handlePasswordSubmit,
    handleDecryptMessage,
    handleEncryptToggle
  } = useConversations();

  const {
    isTyping,
    selectedModel,
    setSelectedModel,
    handleSendMessage
  } = useChatMessaging(
    currentConversationId,
    isEncrypted,
    chatPassword,
    messages,
    setMessages,
    loadConversations
  );

  const handleChangeSection = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handlePasswordDialogSubmit = async (password: string) => {
    return handlePasswordSubmit(password, isCreatingPassword);
  };

  const handleEncryptToggleWithDialog = () => {
    const { showPasswordDialog: newShowPasswordDialog, isCreatingPassword: newIsCreatingPassword } = handleEncryptToggle();
    setShowPasswordDialog(newShowPasswordDialog);
    setIsCreatingPassword(newIsCreatingPassword);
    return { showPasswordDialog: newShowPasswordDialog, isCreatingPassword: newIsCreatingPassword };
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'tasks':
        return <TasksSection />;
      case 'notes':
        return <NotesSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'pomodoro':
        return <PomodoroSection />;
      case 'lowcode-news':
        return <LowCodeNewsSection />;
      case 'chat':
      default:
        return (
          <ChatContent
            messages={messages}
            isTyping={isTyping}
            currentConversationId={currentConversationId}
            isEncrypted={isEncrypted}
            onDecryptMessage={handleDecryptMessage}
            handleSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleNewConversation={handleNewConversation}
            setCurrentConversationId={setCurrentConversationId}
            conversations={conversations}
            onEncryptToggle={handleEncryptToggleWithDialog}
            isLoadingConversation={isLoadingConversation}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0F0F0F]">
      <div 
        className={`fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out lg:relative ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar 
          onClose={() => setShowSidebar(false)} 
          onChangeSection={handleChangeSection}
          activeSection={activeSection}
        />
      </div>
      
      <div className="flex flex-1 flex-col w-full">
        <ChatHeader
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          isEncrypted={isEncrypted}
          onEncryptToggle={handleEncryptToggleWithDialog}
          activeSection={activeSection}
          setShowPasswordDialog={setShowPasswordDialog}
          setIsCreatingPassword={setIsCreatingPassword}
        />
        
        <div className="flex flex-col h-full">
          {renderActiveSection()}
        </div>
      </div>
      
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSubmit={handlePasswordDialogSubmit}
        isCreating={isCreatingPassword}
        title={isCreatingPassword ? "Criar senha" : "Digite a senha"}
        description={
          isCreatingPassword 
            ? "Crie uma senha para proteger esta conversa. Você precisará desta senha para acessar a conversa novamente."
            : "Esta conversa está protegida por senha. Digite a senha para visualizar o conteúdo."
        }
      />
    </div>
  );
};

export default ChatLayout;
