
import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';

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

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
      <div className="p-6 flex-1 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Tarefas</h1>
        
        {/* Add task form */}
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

        {/* Tasks list */}
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
    </div>
  );
};

export default TasksSection;
