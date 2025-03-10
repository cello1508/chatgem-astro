
/**
 * Serviço para comunicação com o webhook externo
 */
export const webhookService = {
  /**
   * Envia uma mensagem para o webhook e retorna a resposta
   */
  async sendMessage(message: string): Promise<{ answer: string }> {
    try {
      const response = await fetch('https://autowebhook.mgtautomacoes.cloud/webhook/2627079f-44b4-48b7-9262-60e75f96f917', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
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
