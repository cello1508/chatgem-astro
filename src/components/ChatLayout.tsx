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
import { Music, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessageId = Date.now().toString();
    const userMessage: MessageType = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    try {
      const webhookResponse = await webhookService.sendMessage(content);
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: webhookResponse.answer || "Desculpe, não consegui processar sua pergunta. Tente novamente.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
            <Collapsible
              open={isPlaylistOpen}
              onOpenChange={setIsPlaylistOpen}
              className="w-[300px]"
            >
              <CollapsibleTrigger asChild>
                <div className="bg-[#1DB954]/20 hover:bg-[#1DB954]/30 px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer">
                  <Music size={18} className="text-[#1DB954]" />
                  <span className="text-sm font-medium text-[#1DB954]">Playlist de foco extremo</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="overflow-hidden rounded-xl bg-[#8B1F60] text-white">
                  <iframe 
                    style={{borderRadius:"12px"}} 
                    src="https://open.spotify.com/embed/playlist/5U0foVQIwgsOxpj1EEnEXp?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    title="Spotify Playlist"
                    className="w-full"
                  />
                  
                  <div className="flex items-center justify-center space-x-4 py-3 bg-[#6D1A4D]">
                    <button className="p-2 hover:bg-[#8B1F60] rounded-full transition-colors">
                      <Shuffle size={18} className="text-white/80" />
                    </button>
                    
                    <button className="p-2 hover:bg-[#8B1F60] rounded-full transition-colors">
                      <SkipBack size={20} className="text-white/80" />
                    </button>
                    
                    <button 
                      className="p-2 rounded-full transition-colors bg-white"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? 
                        <Pause size={24} className="text-[#8B1F60]" /> : 
                        <Play size={24} className="text-[#8B1F60]" />}
                    </button>
                    
                    <button className="p-2 hover:bg-[#8B1F60] rounded-full transition-colors">
                      <SkipForward size={20} className="text-white/80" />
                    </button>
                    
                    <button className="p-2 hover:bg-[#8B1F60] rounded-full transition-colors">
                      <Repeat size={18} className="text-white/80" />
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
