
import React, { useState } from 'react';
import { X, Plus, MessageSquare } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Conversa anterior 1', date: '12 Jun' },
    { id: '2', title: 'Ajuda com código React', date: '10 Jun' },
    { id: '3', title: 'Ideias para novo projeto', date: '8 Jun' },
  ]);

  return (
    <div className="h-full w-[280px] glass flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="font-medium">Conversas</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-700/50"
        >
          <X size={18} />
        </button>
      </div>

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

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-semibold">U</span>
          </div>
          <div className="text-sm">Usuário</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
