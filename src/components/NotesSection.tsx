
import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: '1', 
      title: 'Ideias para o projeto', 
      content: 'Implementar sistema de notas, tarefas e integração com calendário.',
      createdAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      title: 'Recursos para aprender', 
      content: 'React, TypeScript, Tailwind CSS, APIs REST.',
      createdAt: new Date().toISOString() 
    },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    if (editingNoteId) {
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { 
              ...note, 
              title: newNoteTitle, 
              content: newNoteContent,
            } 
          : note
      ));
      setEditingNoteId(null);
    } else {
      const note: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: new Date().toISOString(),
      };
      setNotes([...notes, note]);
    }

    setNewNoteTitle('');
    setNewNoteContent('');
    setShowNoteForm(false);
  };

  const startEditNote = (note: Note) => {
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setEditingNoteId(note.id);
    setShowNoteForm(true);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Anotações</h1>
          {!showNoteForm && (
            <button 
              onClick={() => setShowNoteForm(true)}
              className="bg-success/10 text-success rounded-lg p-2 flex items-center gap-1 hover:bg-success/20 transition-all"
            >
              <Plus size={18} />
              <span>Nova nota</span>
            </button>
          )}
        </div>
        
        {/* Note form */}
        {showNoteForm && (
          <form onSubmit={handleAddNote} className="mb-6 glass p-4 rounded-xl">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Título da nota"
              className="w-full bg-transparent px-3 py-2 text-gray-100 focus:outline-none placeholder:text-gray-500 mb-3 border-b border-gray-700"
            />
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Conteúdo da nota..."
              className="w-full bg-transparent px-3 py-2 text-gray-100 focus:outline-none placeholder:text-gray-500 min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setShowNoteForm(false);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                  setEditingNoteId(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!newNoteTitle.trim()}
                className={`px-4 py-2 rounded-lg ${
                  newNoteTitle.trim() 
                    ? 'bg-success hover:bg-success/90 text-black' 
                    : 'bg-gray-700 text-gray-400'
                } transition-colors`}
              >
                {editingNoteId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        )}

        {/* Notes list */}
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="glass p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{note.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditNote(note)}
                    className="text-gray-400 hover:text-success transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-line">{note.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
