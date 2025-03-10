
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

interface BitcoinDataPoint {
  timestamp: number;
  price: number;
}

interface ChartProps {
  period: string;
}

const BitcoinChart: React.FC<ChartProps> = ({ period }) => {
  const [chartData, setChartData] = useState<BitcoinDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      setLoading(true);
      try {
        // Determine time range based on period
        const now = new Date();
        let startTime = new Date();
        
        switch(period) {
          case '1h':
            startTime.setHours(startTime.getHours() - 1);
            break;
          case '7d':
            startTime.setDate(startTime.getDate() - 7);
            break;
          case '1m':
            startTime.setMonth(startTime.getMonth() - 1);
            break;
          case '1y':
            startTime.setFullYear(startTime.getFullYear() - 1);
            break;
          default:
            startTime.setHours(startTime.getHours() - 1);
        }

        const response = await fetch(
          `https://api.coincap.io/v2/assets/bitcoin/history?interval=${
            period === '1h' ? 'm5' : 
            period === '7d' ? 'h2' : 
            period === '1m' ? 'd1' : 
            'd1'
          }&start=${startTime.getTime()}&end=${now.getTime()}`
        );
        
        const data = await response.json();
        
        if (data && data.data) {
          const formattedData = data.data.map((item: any) => ({
            timestamp: item.time,
            price: parseFloat(item.priceUsd)
          }));
          
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching Bitcoin historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitcoinData();
  }, [period]);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    
    if (period === '1h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (period === '7d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-3 w-full h-24">
        <div className="h-full w-full bg-gray-700/30 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-24 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            tick={{ fill: '#888', fontSize: 10 }}
            stroke="#444"
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fill: '#888', fontSize: 10 }}
            stroke="#444"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
            width={60}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
            labelFormatter={(label) => new Date(label).toLocaleString()}
            contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '4px' }}
            itemStyle={{ color: '#38D784' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#38D784" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#38D784', stroke: '#1c1c1c', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BitcoinChart;
