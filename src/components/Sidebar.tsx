
import React from 'react';
import { Home, ListTodo, FileText, Calendar, Timer, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  onClose: () => void;
  onChangeSection: (section: string) => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onChangeSection, activeSection }) => {
  const { username, logout } = useAuth();

  const sections = [
    { id: 'chat', icon: <Home size={24} />, label: 'Assistente' },
    { id: 'tasks', icon: <ListTodo size={24} />, label: 'Tarefas' },
    { id: 'notes', icon: <FileText size={24} />, label: 'Notas' },
    { id: 'calendar', icon: <Calendar size={24} />, label: 'Calendário' },
    { id: 'pomodoro', icon: <Timer size={24} />, label: 'Pomodoro' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Configurações' },
  ];

  return (
    <div className="h-screen w-64 glass border-r border-gray-800">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Produtividade</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg font-semibold">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="text-gray-200 font-medium">{username || 'Usuário'}</div>
              <div className="text-gray-400 text-sm">Usuário Gratuito</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onChangeSection(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'
              }`}
            >
              <span className="flex-shrink-0">{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200 transition-colors"
          >
            <LogOut size={24} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
