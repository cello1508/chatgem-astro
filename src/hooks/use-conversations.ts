
import { useState, useEffect } from 'react';
import { MessageType } from '@/types/chat';
import { webhookService } from '@/services/webhookService';
import { useToast } from '@/hooks/use-toast';

export function useConversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [chatPassword, setChatPassword] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const conversationsData = await webhookService.getConversations();
      setConversations(conversationsData);
      
      if (!currentConversationId && conversationsData.length > 0) {
        setCurrentConversationId(conversationsData[0].id);
      } else if (!currentConversationId) {
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

  const loadMessages = async (conversationId: string) => {
    setIsLoadingConversation(true);
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      const isEncrypted = conversation?.is_encrypted || false;
      setIsEncrypted(isEncrypted);
      
      if (isEncrypted && !chatPassword) {
        setMessages([{
          id: 'encrypted-placeholder',
          role: 'assistant',
          content: 'Esta conversa está criptografada. Digite a senha para visualizar.',
          timestamp: new Date().toISOString(),
        }]);
        setIsLoadingConversation(false);
        return { showPasswordDialog: true, isCreatingPassword: false };
      }
      
      const messagesData = await webhookService.getMessages(conversationId);
      
      if (messagesData.length === 0) {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: 'Olá! Como posso ajudar você hoje? Você pode me fazer perguntas ou usar os recursos de produtividade no menu lateral.',
          timestamp: new Date().toISOString(),
        }]);
      } else {
        // Ensure all messages have the correct role type
        const typedMessages = messagesData.map(msg => ({
          ...msg,
          role: msg.role === 'user' ? 'user' : 'assistant' as 'user' | 'assistant'
        }));
        setMessages(typedMessages);
      }
      return { showPasswordDialog: false, isCreatingPassword: false };
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
      return { showPasswordDialog: false, isCreatingPassword: false };
    } finally {
      setIsLoadingConversation(false);
    }
  };

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

  const handlePasswordSubmit = async (password: string, isCreating: boolean) => {
    if (isCreating) {
      try {
        if (currentConversationId) {
          await webhookService.setConversationPassword(currentConversationId, password);
          setIsEncrypted(true);
          setChatPassword(password);
          loadConversations();
          return true;
        }
      } catch (error) {
        console.error('Erro ao criar senha:', error);
        return false;
      }
    } else {
      try {
        if (currentConversationId) {
          const isValid = await webhookService.verifyConversationPassword(
            currentConversationId, 
            password
          );
          
          if (isValid) {
            setChatPassword(password);
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

  const handleEncryptToggle = () => {
    if (isEncrypted) {
      setIsEncrypted(false);
      setChatPassword(null);
      toast({
        title: "Criptografia desativada",
        description: "A conversa agora está desprotegida.",
      });
      return { showPasswordDialog: false, isCreatingPassword: false };
    } else {
      return { showPasswordDialog: true, isCreatingPassword: true };
    }
  };

  return {
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
  };
}
