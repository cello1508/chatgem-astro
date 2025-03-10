
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Meh } from 'lucide-react';

interface FearGreedIndexProps {
  className?: string;
}

type FearGreedData = {
  value: number;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
};

const FearGreedIndex: React.FC<FearGreedIndexProps> = ({ className }) => {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.alternative.me/fng/');
        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
          setFearGreedData(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching Fear & Greed Index:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedIndex();
  }, []);

  const getFearGreedColor = () => {
    if (!fearGreedData) return '#888888';
    
    const value = fearGreedData.value;
    
    if (value >= 0 && value <= 24) return '#ea384c'; // Extreme Fear (Red)
    if (value >= 25 && value <= 44) return '#ff8c00'; // Fear (Orange)
    if (value >= 45 && value <= 55) return '#ffee00'; // Neutral (Yellow)
    if (value >= 56 && value <= 75) return '#90ee90'; // Greed (Light Green)
    if (value >= 76 && value <= 100) return '#38D784'; // Extreme Greed (Green)
    
    return '#888888';
  };

  const getFearGreedIcon = () => {
    if (!fearGreedData) return <Meh className="w-5 h-5" />;
    
    const value = fearGreedData.value;
    
    if (value < 45) return <TrendingDown className="w-5 h-5" style={{ color: getFearGreedColor() }} />;
    if (value > 55) return <TrendingUp className="w-5 h-5" style={{ color: getFearGreedColor() }} />;
    
    return <Meh className="w-5 h-5" style={{ color: getFearGreedColor() }} />;
  };

  if (loading) {
    return (
      <div className={`animate-pulse flex flex-col space-y-3 w-full h-full ${className}`}>
        <div className="h-full w-full bg-gray-700/30 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1f1f1f] p-4 rounded-md w-full h-full ${className}`}>
      <p className="text-sm text-gray-400 mb-2">Índice de Medo e Ganância</p>
      
      {fearGreedData ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getFearGreedIcon()}
            <span className="ml-2 text-xl font-semibold" style={{ color: getFearGreedColor() }}>
              {fearGreedData.value}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: getFearGreedColor() }}>
              {fearGreedData.value_classification}
            </p>
            <p className="text-xs text-gray-400">
              Atualizado: {new Date(fearGreedData.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Índice indisponível</p>
      )}
      
      <div className="mt-4 w-full bg-gray-800 h-8 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div className="bg-red-600 h-full" style={{ width: '20%' }} title="Medo Extremo"></div>
          <div className="bg-orange-500 h-full" style={{ width: '20%' }} title="Medo"></div>
          <div className="bg-yellow-400 h-full" style={{ width: '20%' }} title="Neutro"></div>
          <div className="bg-green-400 h-full" style={{ width: '20%' }} title="Ganância"></div>
          <div className="bg-green-600 h-full" style={{ width: '20%' }} title="Ganância Extrema"></div>
        </div>
        {fearGreedData && (
          <div 
            className="relative h-4 w-4 bg-white rounded-full shadow-md border-2 border-gray-800"
            style={{ 
              marginTop: '-16px', 
              marginLeft: `calc(${fearGreedData.value}% - 8px)`,
            }}
          />
        )}
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Medo Extremo</span>
        <span>Ganância Extrema</span>
      </div>
    </div>
  );
};

export default FearGreedIndex;
