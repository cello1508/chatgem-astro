
import { useState } from 'react';
import { MessageType } from '@/types/chat';
import { webhookService } from '@/services/webhookService';
import { useToast } from '@/hooks/use-toast';

export function useChatMessaging(
  currentConversationId: string | null,
  isEncrypted: boolean,
  chatPassword: string | null,
  messages: MessageType[],
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  loadConversations: () => Promise<void>
) {
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const { toast } = useToast();

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
    
    setMessages(prev => [...prev, userMessage]);
    
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
      const webhookResponse = await webhookService.sendMessage(content, selectedModel);
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: webhookResponse.answer || "Desculpe, não consegui processar sua pergunta. Tente novamente.",
        timestamp: new Date().toISOString(),
        modelId: selectedModel,
      };
      
      let encryptedResponse: string | undefined = undefined;
      if (isEncrypted && chatPassword) {
        try {
          encryptedResponse = await webhookService.encryptText(assistantMessage.content, chatPassword);
        } catch (error) {
          console.error('Erro ao criptografar resposta:', error);
        }
      }
      
      setMessages(prev => [...prev, assistantMessage]);
      
      try {
        await webhookService.saveMessage(
          currentConversationId, 
          assistantMessage, 
          isEncrypted,
          encryptedResponse
        );
        
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
      
      try {
        await webhookService.saveMessage(currentConversationId, errorMessage);
      } catch (saveError) {
        console.error('Erro ao salvar mensagem de erro:', saveError);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return {
    isTyping,
    selectedModel,
    setSelectedModel,
    handleSendMessage
  };
}
