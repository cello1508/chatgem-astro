
import React, { useState } from 'react';
import { X, Plus, MessageSquare, Calendar, CheckSquare, FileText, Clock, Puzzle, Grid } from 'lucide-react';
import ProductivityChart from './ProductivityChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [pluginDialogOpen, setPluginDialogOpen] = useState(false);

  const sections = [
    { id: 'chat', title: 'Assistente IA', icon: MessageSquare },
    { id: 'tasks', title: 'Tarefas', icon: CheckSquare },
    { id: 'notes', title: 'Anotações', icon: FileText },
    { id: 'calendar', title: 'Agenda', icon: Calendar },
    { id: 'pomodoro', title: 'Pomodoro', icon: Clock },
  ];
  
  const plugins = [
    { id: 'translator', name: 'Tradutor', description: 'Tradução entre idiomas' },
    { id: 'calculator', name: 'Calculadora', description: 'Cálculos e conversões' },
    { id: 'summarizer', name: 'Resumidor', description: 'Resumo de textos longos' },
    { id: 'image-gen', name: 'Gerador de Imagens', description: 'Crie imagens com IA' },
    { id: 'code-helper', name: 'Ajudante de Código', description: 'Assistência em programação' },
    { id: 'data-viz', name: 'Visualização de Dados', description: 'Gráficos e relatórios' },
    { id: 'meeting-notes', name: 'Notas de Reunião', description: 'Organização de reuniões' },
    { id: 'file-converter', name: 'Conversor de Arquivos', description: 'Converta entre formatos' },
  ];

  const togglePlugins = () => {
    setShowPlugins(!showPlugins);
  };

  const openPluginGallery = () => {
    setPluginDialogOpen(true);
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

      {/* Plugin Library Dropdown (shows when togglePlugins is true) */}
      {showPlugins && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <Puzzle size={15} /> Biblioteca de Plugins
              </h3>
              <button 
                onClick={openPluginGallery}
                className="text-xs text-success hover:underline"
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-1.5">
              {plugins.slice(0, 4).map(plugin => (
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

      {/* Plugin Gallery Dialog */}
      <Dialog open={pluginDialogOpen} onOpenChange={setPluginDialogOpen}>
        <DialogContent className="glass border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Puzzle size={18} /> Galeria de Plugins
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-[70vh] overflow-y-auto p-1">
            {plugins.map(plugin => (
              <div
                key={plugin.id}
                className="bg-gray-800/60 rounded-lg p-4 hover:bg-gray-700/70 transition-all border border-gray-700/50 cursor-pointer"
              >
                <h3 className="font-medium mb-1">{plugin.name}</h3>
                <p className="text-sm text-gray-400">{plugin.description}</p>
                <div className="flex justify-end mt-3">
                  <button className="text-xs bg-success/10 hover:bg-success/20 text-success px-3 py-1 rounded transition-all">
                    Instalar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="text-sm">Usuário</div>
          </div>
          <div className="flex items-center gap-2">
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
            <button 
              onClick={openPluginGallery}
              className="p-1.5 rounded-md hover:bg-gray-700/50 text-gray-300 transition-all"
              title="Galeria de Plugins"
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
