
export interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isProcessing?: boolean;
  modelId?: string;
  encrypted_content?: string;
}
