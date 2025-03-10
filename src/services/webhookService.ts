
/**
 * Serviço para comunicação com o webhook externo
 */
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
};
