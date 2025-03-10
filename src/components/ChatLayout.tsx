import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TasksSection from './TasksSection';
import NotesSection from './NotesSection';
import CalendarSection from './CalendarSection';
import PomodoroSection from './PomodoroSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { MessageType } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { webhookService } from '@/services/webhookService';
import { Music } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState('chat');
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Como posso ajudar você hoje? Você pode me fazer perguntas ou usar os recursos de produtividade no menu lateral.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const [playlistActive, setPlaylistActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlaylist = () => {
    setPlaylistActive(!playlistActive);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: MessageType = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate assistant typing
    setIsTyping(true);
    
    try {
      // Enviar a mensagem para o webhook
      const webhookResponse = await webhookService.sendMessage(content);
      
      // Adicionar resposta do assistente com base na resposta do webhook
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: webhookResponse.answer || "Desculpe, não consegui processar sua pergunta. Tente novamente.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Em caso de erro na chamada do webhook
      console.error('Erro ao processar mensagem:', error);
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível obter resposta do servidor. Tente novamente.",
        variant: "destructive",
      });
      
      // Adicionar mensagem de erro como resposta do assistente
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChangeSection = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    console.log('Next track');
  };

  const handlePrevious = () => {
    console.log('Previous track');
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
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
      case 'chat':
      default:
        return (
          <>
            <MessageList messages={messages} isTyping={isTyping} />
            <div className="p-4 pb-6 w-full">
              <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
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
        <div className="sticky top-0 z-10 p-2 flex justify-between items-center glass">
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
          
          <div className="ml-auto">
            <button 
              onClick={togglePlaylist}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                playlistActive 
                  ? 'bg-success/20 text-success' 
                  : 'hover:bg-gray-700/50 text-gray-300'
              }`}
              title="Playlist de foco extremo"
            >
              <Music size={18} />
              <span className="text-sm">Playlist de foco extremo</span>
            </button>
          </div>
        </div>
        
        {playlistActive && (
          <div className="mx-4 p-4 glass rounded-lg border border-gray-800/50 animate-fade-in">
            <MusicPlayer 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              progress={progress}
              onProgressChange={handleProgressChange}
            />
          </div>
        )}
        
        <div className="flex flex-col h-full">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
