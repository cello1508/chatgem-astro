
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Share2, Check, Copy } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ProductivityData {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_DATA: ProductivityData[] = [
  { name: 'Foco', value: 35, color: '#38D784' },
  { name: 'Tarefas', value: 25, color: '#3B82F6' },
  { name: 'Notas', value: 15, color: '#F59E0B' },
  { name: 'Reuniões', value: 25, color: '#EC4899' },
];

const ProductivityChart: React.FC = () => {
  const data = DEFAULT_DATA;
  const totalHours = data.reduce((sum, item) => sum + item.value, 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [retrospectiveText, setRetrospectiveText] = useState('');
  
  const generateRetrospective = () => {
    // Generate retrospective summary
    const retrospective = {
      totalHours,
      focusPercentage: Math.round((data[0].value / totalHours) * 100),
      tasksCompleted: 12, // Mock data
      notesCreated: 5,    // Mock data
      pomodorosDone: 8,   // Mock data
    };
    
    const text = 
      `✨ Minha Retrospectiva de Produtividade ✨\n\n` +
      `Total de horas produtivas: ${totalHours}h\n` +
      `Foco: ${retrospective.focusPercentage}%\n` +
      `Tarefas completadas: ${retrospective.tasksCompleted}\n` +
      `Pomodoros realizados: ${retrospective.pomodorosDone}\n` +
      `Anotações criadas: ${retrospective.notesCreated}`;
    
    setRetrospectiveText(text);
    setDialogOpen(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(retrospectiveText).then(() => {
      toast.success("Retrospectiva copiada para a área de transferência!");
      setDialogOpen(false);
    });
  };
  
  return (
    <>
      <div className="glass rounded-xl p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-success" />
            <h3 className="text-sm font-medium">Produtividade</h3>
          </div>
          <button 
            onClick={generateRetrospective}
            className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-2.5 py-1 rounded-full hover:bg-success/20 transition-colors"
          >
            <Share2 size={14} />
            Compartilhar
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}h`, 'Tempo']}
                  contentStyle={{ background: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 ml-2">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-1.5">
              <p className="text-xs text-gray-400">Total: {totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Retrospectiva</DialogTitle>
            <DialogDescription>
              Compartilhe sua retrospectiva de produtividade nas redes sociais.
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
    </>
  );
};

export default ProductivityChart;
