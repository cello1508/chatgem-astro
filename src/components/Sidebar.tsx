
import React, { useState } from 'react';
import { X, Plus, MessageSquare, Calendar, CheckSquare, FileText, Clock, Plug, Grid } from 'lucide-react';
import ProductivityChart from './ProductivityChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SidebarProps {
  onClose: () => void;
  onChangeSection: (section: string) => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onChangeSection, activeSection }) => {
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

  const openPluginGallery = () => {
    setPluginDialogOpen(true);
  };

  return (
    <div className="h-full w-[280px] glass flex flex-col relative">
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
      <div className="p-3 overflow-y-auto" style={{ flex: '1 1 auto' }}>
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

      {/* Productivity Chart container */}
      <div className="relative mb-16" style={{ height: '100px' }}>
        <ProductivityChart />
      </div>

      {/* Plugin Gallery Dialog */}
      <Dialog open={pluginDialogOpen} onOpenChange={setPluginDialogOpen}>
        <DialogContent className="glass border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plug size={18} /> Galeria de Plugins
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

      {/* Footer - fixed at the bottom */}
      <div className="p-4 border-t border-gray-800 mt-auto z-20 relative bg-[#171717]/70 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-semibold">U</span>
            </div>
            <div className="text-sm">Usuário</div>
          </div>
          <div>
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
