
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import CalendarSection from './CalendarSection';
import PomodoroSection from './PomodoroSection';
import LowCodeNewsSection from './LowCodeNewsSection';
import GreetingInfo from './GreetingInfo';
import PasswordDialog from './PasswordDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageType } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { webhookService } from '@/services/webhookService';
import { Lock, Unlock } from 'lucide-react';
import { Button } from './ui/button';

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [chatPassword, setChatPassword] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const { toast } = useToast();

  // Check if any user messages exist
  const hasUserMessages = messages.some(message => message.role === 'user');

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load a conversation when ID changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  // Load all conversations from Supabase
  const loadConversations = async () => {
    try {
      const conversationsData = await webhookService.getConversations();
      setConversations(conversationsData);
      
      // If no conversation is selected yet and there are conversations
      if (!currentConversationId && conversationsData.length > 0) {
        setCurrentConversationId(conversationsData[0].id);
      } else if (!currentConversationId) {
        // If no conversations exist, create one
        const newConversation = await webhookService.createConversation();
        setCurrentConversationId(newConversation.id);
        setConversations([newConversation]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Não foi possível carregar suas conversas anteriores.",
        variant: "destructive",
      });
    }
  };

  // Load messages for a specific conversation
  const loadMessages = async (conversationId: string) => {
    setIsLoadingConversation(true);
    try {
      // Check if the conversation is encrypted
      const conversation = conversations.find(c => c.id === conversationId);
      const isEncrypted = conversation?.is_encrypted || false;
      setIsEncrypted(isEncrypted);
      
      // If encrypted and we don't have the password, prompt for it
      if (isEncrypted && !chatPassword) {
        setMessages([{
          id: 'encrypted-placeholder',
          role: 'assistant',
          content: 'Esta conversa está criptografada. Digite a senha para visualizar.',
          timestamp: new Date().toISOString(),
        }]);
        setShowPasswordDialog(true);
        setIsCreatingPassword(false);
        setIsLoadingConversation(false);
        return;
      }
      
      // Load messages
      const messagesData = await webhookService.getMessages(conversationId);
      
      if (messagesData.length === 0) {
        // If no messages, add a welcome message
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Olá! Como posso ajudar você hoje? Você pode me fazer perguntas ou usar os recursos de produtividade no menu lateral.',
          timestamp: new Date().toISOString(),
        }]);
      } else {
        // If there are messages
        if (isEncrypted && chatPassword) {
          // If encrypted and we have the password, decrypt them
          setMessages(messagesData);
        } else {
          // If not encrypted, just set them
          setMessages(messagesData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: "Não foi possível carregar as mensagens desta conversa.",
        variant: "destructive",
      });
      setMessages([{
        id: 'error-placeholder',
        role: 'assistant',
        content: 'Ocorreu um erro ao carregar as mensagens. Tente novamente mais tarde.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  // Create a new conversation
  const handleNewConversation = async () => {
    try {
      const newConversation = await webhookService.createConversation();
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      setIsEncrypted(false);
      setChatPassword(null);
      toast({
        title: "Nova conversa",
        description: "Nova conversa criada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar uma nova conversa.",
        variant: "destructive",
      });
    }
  };

  // Toggle encryption for the current conversation
  const handleEncryptToggle = () => {
    if (isEncrypted) {
      // Disable encryption
      setIsEncrypted(false);
      setChatPassword(null);
      toast({
        title: "Criptografia desativada",
        description: "A conversa agora está desprotegida.",
      });
    } else {
      // Enable encryption
      setShowPasswordDialog(true);
      setIsCreatingPassword(true);
    }
  };

  // Create or verify password for encrypted conversation
  const handlePasswordSubmit = async (password: string) => {
    if (isCreatingPassword) {
      // Setting a new password
      try {
        if (currentConversationId) {
          await webhookService.setConversationPassword(currentConversationId, password);
          setIsEncrypted(true);
          setChatPassword(password);
          
          // Update conversations list
          loadConversations();
          return true;
        }
      } catch (error) {
        console.error('Erro ao criar senha:', error);
        return false;
      }
    } else {
      // Verifying password
      try {
        if (currentConversationId) {
          const isValid = await webhookService.verifyConversationPassword(
            currentConversationId, 
            password
          );
          
          if (isValid) {
            setChatPassword(password);
            // Now reload messages with the password
            loadMessages(currentConversationId);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Erro ao verificar senha:', error);
        return false;
      }
    }
    return false;
  };

  // Decrypt a message when requested
  const handleDecryptMessage = async (message: MessageType): Promise<MessageType> => {
    if (!message.encrypted_content || !chatPassword) {
      return message;
    }
    
    try {
      const decryptedText = await webhookService.decryptText(
        message.encrypted_content,
        chatPassword
      );
      
      return {
        ...message,
        content: decryptedText
      };
    } catch (error) {
      console.error('Erro ao descriptografar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível descriptografar a mensagem. A senha pode estar incorreta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !currentConversationId) return;
    
    const userMessageId = Date.now().toString();
    const userMessage: MessageType = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    let encryptedContent: string | undefined = undefined;
    
    // If encryption is enabled, encrypt the message
    if (isEncrypted && chatPassword) {
      try {
        encryptedContent = await webhookService.encryptText(content, chatPassword);
      } catch (error) {
        console.error('Erro ao criptografar mensagem:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criptografar sua mensagem.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Add message to UI
    setMessages(prev => [...prev, userMessage]);
    
    // Save message to Supabase
    try {
      await webhookService.saveMessage(
        currentConversationId, 
        userMessage, 
        isEncrypted,
        encryptedContent
      );
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
    
    setIsTyping(true);
    
    try {
      // Pass the modelId to the webhookService
      const webhookResponse = await webhookService.sendMessage(content, selectedModel);
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: webhookResponse.answer || "Desculpe, não consegui processar sua pergunta. Tente novamente.",
        timestamp: new Date().toISOString(),
        modelId: selectedModel, // Store the model ID with the message
      };
      
      // If encryption is enabled, encrypt the response
      let encryptedResponse: string | undefined = undefined;
      if (isEncrypted && chatPassword) {
        try {
          encryptedResponse = await webhookService.encryptText(assistantMessage.content, chatPassword);
        } catch (error) {
          console.error('Erro ao criptografar resposta:', error);
        }
      }
      
      // Add message to UI
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save message to Supabase
      try {
        await webhookService.saveMessage(
          currentConversationId, 
          assistantMessage, 
          isEncrypted,
          encryptedResponse
        );
        
        // Refresh conversations list to update the "updated_at" timestamp
        loadConversations();
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível obter resposta do servidor. Tente novamente.",
        variant: "destructive",
      });
      
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to Supabase
      try {
        await webhookService.saveMessage(currentConversationId, errorMessage);
      } catch (saveError) {
        console.error('Erro ao salvar mensagem de erro:', saveError);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleChangeSection = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setShowSidebar(false);
    }
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
          <>
            {!hasUserMessages && (
              <div className="px-4 md:px-8 pt-4">
                <GreetingInfo 
                  selectedModel={selectedModel}
                  onSelectModel={handleSelectModel}
                />
              </div>
            )}
            <MessageList 
              messages={messages} 
              isTyping={isTyping} 
              conversationId={currentConversationId || undefined}
              needsDecryption={isEncrypted}
              onDecryptMessage={handleDecryptMessage}
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
                onEncryptToggle={handleEncryptToggle}
              />
            </div>
          </>
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
        <div className="sticky top-0 z-10 p-2 flex justify-between items-center glass w-full">
          {isMobile && (
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-md bg-[#171717]/80 border border-gray-800 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          
          {currentConversationId && activeSection === 'chat' && (
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEncryptToggle}
                className="text-gray-400 hover:text-white"
                title={isEncrypted ? "Desativar criptografia" : "Ativar criptografia"}
              >
                {isEncrypted ? (
                  <Lock size={18} className="text-amber-500" />
                ) : (
                  <Unlock size={18} />
                )}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col h-full">
          {renderActiveSection()}
        </div>
      </div>
      
      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSubmit={handlePasswordSubmit}
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
