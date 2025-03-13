
import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import GreetingInfo from './GreetingInfo';
import { MessageType } from '@/types/chat';

interface ChatContentProps {
  messages: MessageType[];
  isTyping: boolean;
  currentConversationId: string | null;
  isEncrypted: boolean;
  onDecryptMessage: (message: MessageType) => Promise<MessageType>;
  handleSendMessage: (content: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleNewConversation: () => Promise<void>;
  setCurrentConversationId: (id: string) => void;
  conversations: any[];
  onEncryptToggle: () => { showPasswordDialog: boolean; isCreatingPassword: boolean };
  isLoadingConversation: boolean;
}

const ChatContent: React.FC<ChatContentProps> = ({
  messages,
  isTyping,
  currentConversationId,
  isEncrypted,
  onDecryptMessage,
  handleSendMessage,
  selectedModel,
  setSelectedModel,
  handleNewConversation,
  setCurrentConversationId,
  conversations,
  onEncryptToggle,
  isLoadingConversation
}) => {
  const hasUserMessages = messages.some(message => message.role === 'user');

  return (
    <>
      {!hasUserMessages && (
        <div className="px-4 md:px-8 pt-4">
          <GreetingInfo 
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      )}
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        conversationId={currentConversationId || undefined}
        needsDecryption={isEncrypted}
        onDecryptMessage={onDecryptMessage}
      />
      <div className="p-4 pb-6 w-full">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isTyping || isLoadingConversation} 
          conversationId={currentConversationId || undefined}
          onNewConversation={handleNewConversation}
          onSelectConversation={setCurrentConversationId}
          conversations={conversations}
          isEncrypted={isEncrypted}
          onEncryptToggle={onEncryptToggle}
        />
      </div>
    </>
  );
};

export default ChatContent;
