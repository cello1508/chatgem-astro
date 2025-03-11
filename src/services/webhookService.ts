
/**
 * Serviço para comunicação com o webhook externo e gerenciamento de conversas
 */
import { supabase } from '@/integrations/supabase/client';
import { MessageType } from '@/types/chat';

export const webhookService = {
  /**
   * Envia uma mensagem para o webhook e retorna a resposta
   * @param message - Mensagem a ser enviada
   * @param modelId - ID opcional do modelo de linguagem a ser usado
   */
  async sendMessage(message: string, modelId?: string): Promise<{ answer: string }> {
    try {
      // Preparar payload com o modelo selecionado, se fornecido
      const payload = {
        message,
        ...(modelId && { model: modelId }),
      };
      
      const response = await fetch('https://autowebhook.mgtautomacoes.cloud/webhook/2627079f-44b4-48b7-9262-60e75f96f917', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta do webhook: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao chamar o webhook:', error);
      throw error;
    }
  },

  /**
   * Carrega todas as conversas do Supabase
   */
  async getConversations() {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return conversations;
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      throw error;
    }
  },

  /**
   * Cria uma nova conversa
   * @param name - Nome da conversa
   */
  async createConversation(name: string = 'Nova conversa') {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw error;
    }
  },

  /**
   * Carrega os mensagens de uma conversa
   * @param conversationId - ID da conversa
   */
  async getMessages(conversationId: string) {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return messages;
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      throw error;
    }
  },

  /**
   * Salva uma mensagem na conversa
   * @param conversationId - ID da conversa
   * @param message - Mensagem a ser salva
   */
  async saveMessage(conversationId: string, message: MessageType, isEncrypted: boolean = false, encryptedContent?: string) {
    try {
      // Atualiza a data da conversa para mostrar atividade recente
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      // Insere a mensagem
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: isEncrypted ? 'ENCRYPTED_CONTENT' : message.content,
          encrypted_content: encryptedContent,
          timestamp: message.timestamp,
          model_id: message.modelId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      throw error;
    }
  },

  /**
   * Define ou atualiza a senha de criptografia de uma conversa
   * @param conversationId - ID da conversa
   * @param password - Nova senha
   */
  async setConversationPassword(conversationId: string, password: string) {
    try {
      // Usa a edge function para gerar o hash da senha
      const response = await supabase.functions.invoke('crypto-utils', {
        body: {
          action: 'hash-password',
          data: { password }
        }
      });

      const { hash, salt } = response.data;

      // Atualiza a conversa
      const { error } = await supabase
        .from('conversations')
        .update({
          is_encrypted: true,
          password_hash: hash,
          salt: salt
        })
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao definir senha da conversa:', error);
      throw error;
    }
  },

  /**
   * Verifica se a senha de uma conversa está correta
   * @param conversationId - ID da conversa
   * @param password - Senha a verificar
   */
  async verifyConversationPassword(conversationId: string, password: string) {
    try {
      // Busca a conversa para obter o hash da senha
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('password_hash')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      // Verifica a senha
      const response = await supabase.functions.invoke('crypto-utils', {
        body: {
          action: 'verify-password',
          data: { 
            password,
            hash: conversation.password_hash
          }
        }
      });

      return response.data.isValid;
    } catch (error) {
      console.error('Erro ao verificar senha da conversa:', error);
      throw error;
    }
  },

  /**
   * Criptografa um texto com a senha fornecida
   * @param text - Texto a ser criptografado
   * @param password - Senha de criptografia
   */
  async encryptText(text: string, password: string) {
    try {
      const response = await supabase.functions.invoke('crypto-utils', {
        body: {
          action: 'encrypt',
          data: { text, password }
        }
      });

      return response.data.encryptedText;
    } catch (error) {
      console.error('Erro ao criptografar texto:', error);
      throw error;
    }
  },

  /**
   * Descriptografa um texto com a senha fornecida
   * @param encryptedText - Texto criptografado
   * @param password - Senha de descriptografia
   */
  async decryptText(encryptedText: string, password: string) {
    try {
      const response = await supabase.functions.invoke('crypto-utils', {
        body: {
          action: 'decrypt',
          data: { encryptedText, password }
        }
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data.decryptedText;
    } catch (error) {
      console.error('Erro ao descriptografar texto:', error);
      throw error;
    }
  }
};
