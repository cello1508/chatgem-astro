
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock, Share2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AIModelUsageData {
  name: string;
  value: number;  // Number of uses
  spending: number; // Cost in USD
  color: string;
}

const DEFAULT_DATA: AIModelUsageData[] = [
  { name: 'GPT-3.5 Turbo', value: 145, spending: 2.9, color: '#38D784' },
  { name: 'GPT-4', value: 78, spending: 7.8, color: '#3B82F6' },
  { name: 'Claude 3', value: 54, spending: 5.4, color: '#F59E0B' },
  { name: 'Gemini Pro', value: 23, spending: 1.15, color: '#EC4899' },
];

const ProductivityChart: React.FC = () => {
  const [data] = useState(DEFAULT_DATA);
  const totalUses = data.reduce((sum, item) => sum + item.value, 0);
  const totalSpending = data.reduce((sum, item) => sum + item.spending, 0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [showUsage, setShowUsage] = useState(true);
  
  const generateReport = () => {
    // Generate AI usage report
    const mostUsedModel = [...data].sort((a, b) => b.value - a.value)[0];
    const mostExpensiveModel = [...data].sort((a, b) => b.spending - a.spending)[0];
    
    const text = 
      `📊 Meu Relatório de Uso de IA 📊\n\n` +
      `Total de consultas: ${totalUses}\n` +
      `Total gasto: $${totalSpending.toFixed(2)}\n` +
      `Modelo mais usado: ${mostUsedModel.name} (${mostUsedModel.value} consultas)\n` +
      `Maior gasto: ${mostExpensiveModel.name} ($${mostExpensiveModel.spending.toFixed(2)})\n` +
      `Custo médio por consulta: $${(totalSpending / totalUses).toFixed(3)}`;
    
    setReportText(text);
    setDialogOpen(true);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      toast.success("Relatório copiado para a área de transferência!");
      setDialogOpen(false);
    });
  };
  
  const toggleView = () => {
    setShowUsage(!showUsage);
  };
  
  return (
    <>
      <div className="glass rounded-xl p-4 w-full z-10 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-success" />
            <h3 className="text-sm font-medium">Uso de IA</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="bg-transparent hover:bg-gray-700/30 p-1.5 rounded-full transition-colors"
              onClick={toggleView}
              title={showUsage ? "Ver gastos com IA" : "Ver uso de IA"}
            >
              {showUsage ? <ChevronRight className="w-4 h-4 text-gray-300" /> : <ChevronLeft className="w-4 h-4 text-gray-300" />}
            </button>
            <button 
              onClick={generateReport}
              className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-2.5 py-1 rounded-full hover:bg-success/20 transition-colors"
            >
              <Share2 size={14} />
              Relatório
            </button>
          </div>
        </div>
        
        <div className="min-h-[250px] flex flex-col items-center justify-center transition-all duration-300">
          <div className="w-56 h-56 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey={showUsage ? "value" : "spending"}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    showUsage ? `${value} consultas` : `$${value.toFixed(2)}`, 
                    showUsage ? 'Uso' : 'Gasto'
                  ]}
                  contentStyle={{ background: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-6">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">
                  {item.name}: {showUsage ? `${item.value}` : `$${item.spending.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-lg font-medium mb-2">
              {showUsage 
                ? `Total: ${totalUses} consultas` 
                : `Total: $${totalSpending.toFixed(2)}`}
            </p>
            <p className="text-gray-400 text-sm max-w-[80%] mx-auto">
              {showUsage 
                ? "Quantidade de consultas realizadas em cada modelo de IA."
                : "Gastos realizados com cada modelo de IA."}
            </p>
            
            <button 
              onClick={generateReport}
              className="mt-6 flex items-center gap-2 px-4 py-2 mx-auto text-sm rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
            >
              <Share2 size={18} />
              Gerar Relatório Completo
            </button>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Relatório de Uso de IA</DialogTitle>
            <DialogDescription className="text-gray-500">
              Veja um resumo do seu uso e gastos com modelos de IA.
            </DialogDescription>
          </DialogHeader>
          
          {/* Chart in the dialog with colored labels */}
          <div className="flex flex-col items-center my-4">
            <div className="w-40 h-40 mx-auto mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey={showUsage ? "value" : "spending"}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm" style={{ color: item.color }}>
                    {item.name}: {showUsage ? `${item.value}` : `$${item.spending.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dark box with report */}
          <div className="bg-[#1A2032] rounded-md p-6 my-2 text-white whitespace-pre-wrap">
            {reportText}
          </div>
          
          <DialogFooter className="mt-4">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-full bg-success/10 text-success hover:bg-success/20 transition-colors"
            >
              <Copy size={18} />
              Copiar Relatório
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductivityChart;
