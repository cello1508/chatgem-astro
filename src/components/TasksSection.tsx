
import React, { useState } from 'react';
import { Check, Plus, Trash2, Share, Copy } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Criar apresentação', completed: false, createdAt: new Date().toISOString() },
    { id: '2', text: 'Revisar documentação', completed: true, createdAt: new Date().toISOString() },
  ]);
  const [newTask, setNewTask] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [retrospectiveText, setRetrospectiveText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleShareTasks = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    const completion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    // Generate a simple text retrospective
    const retrospective = 
      `📋 Minha Retrospectiva de Tarefas 📋\n\n` +
      `Progresso: ${completion}% concluído\n` +
      `Tarefas completadas: ${completedTasks}\n` +
      `Tarefas pendentes: ${pendingTasks}\n\n` +
      `Tarefas concluídas:\n${tasks.filter(t => t.completed).map(t => `✓ ${t.text}`).join('\n')}\n\n` +
      `Gerado pelo Productivity AI 🚀`;
    
    setRetrospectiveText(retrospective);
    setDialogOpen(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(retrospectiveText).then(() => {
      toast.success("Retrospectiva de tarefas copiada para a área de transferência!");
      setDialogOpen(false);
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <button
            onClick={handleShareTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
          >
            <Share size={16} />
            Compartilhar
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progresso</span>
            <span className="text-sm text-success">
              {tasks.filter(t => t.completed).length}/{tasks.length} tarefas
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success transition-all duration-500 ease-out"
              style={{ 
                width: `${tasks.length > 0 
                  ? (tasks.filter(t => t.completed).length / tasks.length) * 100 
                  : 0}%` 
              }}
            />
          </div>
        </div>
        
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="glass-input rounded-xl overflow-hidden flex items-center transition-all focus-within:border-success/50 focus-within:shadow-[0_0_10px_rgba(56,215,132,0.15)]">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Adicionar nova tarefa..."
              className="flex-1 bg-transparent px-4 py-3 text-gray-100 focus:outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className={`px-4 py-3 ${
                newTask.trim() ? 'text-success' : 'text-gray-500'
              }`}
            >
              <Plus size={20} />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`glass p-4 rounded-xl flex items-center gap-3 ${
                task.completed ? 'opacity-70' : ''
              }`}
            >
              <button 
                onClick={() => toggleTaskComplete(task.id)}
                className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                  task.completed 
                    ? 'bg-success/20 border-success/50 text-success' 
                    : 'border-gray-600 hover:border-success/50'
                }`}
              >
                {task.completed && <Check size={16} />}
              </button>
              <p className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </p>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Retrospectiva de Tarefas</DialogTitle>
            <DialogDescription>
              Compartilhe seu progresso de tarefas nas redes sociais.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-800 rounded-md p-4 my-2 text-sm whitespace-pre-wrap">
            {retrospectiveText}
          </div>
          <DialogFooter className="sm:justify-start">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
            >
              <Copy size={16} />
              Copiar para Compartilhar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksSection;
