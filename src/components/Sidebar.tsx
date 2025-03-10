
import React, { useState } from 'react';
import { X, Plus, MessageSquare, Calendar, CheckSquare, FileText, Clock, Puzzle } from 'lucide-react';
import ProductivityChart from './ProductivityChart';

interface SidebarProps {
  onClose: () => void;
  onChangeSection: (section: string) => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onChangeSection, activeSection }) => {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Conversa anterior 1', date: '12 Jun' },
    { id: '2', title: 'Ajuda com código React', date: '10 Jun' },
    { id: '3', title: 'Ideias para novo projeto', date: '8 Jun' },
  ]);

  const [showPlugins, setShowPlugins] = useState(false);

  const sections = [
    { id: 'chat', title: 'Assistente IA', icon: MessageSquare },
    { id: 'tasks', title: 'Tarefas', icon: CheckSquare },
    { id: 'notes', title: 'Anotações', icon: FileText },
    { id: 'calendar', title: 'Agenda', icon: Calendar },
    { id: 'pomodoro', title: 'Pomodoro', icon: Clock },
  ];
  
  const plugins = [
    { id: 'translator', name: 'Tradutor' },
    { id: 'calculator', name: 'Calculadora' },
    { id: 'summarizer', name: 'Resumidor' },
    { id: 'image-gen', name: 'Gerador de Imagens' },
  ];

  const togglePlugins = () => {
    setShowPlugins(!showPlugins);
  };

  return (
    <div className="h-full w-[280px] glass flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="font-medium">Productivity AI</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-700/50"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sections */}
      <div className="p-3">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onChangeSection(section.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                activeSection === section.id 
                  ? 'bg-success/20 text-success' 
                  : 'hover:bg-gray-700/30'
              }`}
            >
              <section.icon size={18} />
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content - only show if chat is active */}
      {activeSection === 'chat' && (
        <>
          {/* New chat button */}
          <button className="mx-3 mt-3 bg-success/10 text-success rounded-lg p-3 flex items-center gap-2 hover:bg-success/20 transition-all">
            <Plus size={18} />
            <span>Nova conversa</span>
          </button>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto py-3 px-2">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                className="w-full text-left p-2.5 rounded-lg hover:bg-gray-700/30 mb-1 flex items-start gap-2 transition-all"
              >
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{convo.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{convo.date}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Productivity Chart */}
      <div className="mt-auto px-3 pb-3">
        <ProductivityChart />
      </div>

      {/* Plugin Library (shows when togglePlugins is true) */}
      {showPlugins && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Puzzle size={15} /> Biblioteca de Plugins
            </h3>
            <div className="space-y-1.5">
              {plugins.map(plugin => (
                <button 
                  key={plugin.id}
                  className="w-full text-left text-sm bg-gray-700/30 hover:bg-gray-700/50 rounded px-2.5 py-1.5 transition-all"
                >
                  {plugin.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="text-sm">Usuário</div>
          </div>
          <button 
            onClick={togglePlugins}
            className={`p-1.5 rounded-md transition-all ${
              showPlugins 
                ? 'bg-success/20 text-success' 
                : 'hover:bg-gray-700/50 text-gray-300'
            }`}
            title="Biblioteca de Plugins"
          >
            <Puzzle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
