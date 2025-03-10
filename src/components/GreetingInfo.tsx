
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface WeatherData {
  main?: {
    temp: number;
  };
  weather?: {
    description: string;
    icon: string;
  }[];
  name?: string;
}

type TimePeriod = '1h' | '7d' | '1m' | '1y';

interface PriceData {
  currentPrice: number | null;
  previousPrice: number | null;
}

const GreetingInfo: React.FC = () => {
  const [priceData, setPriceData] = useState<Record<TimePeriod, PriceData>>({
    '1h': { currentPrice: null, previousPrice: null },
    '7d': { currentPrice: null, previousPrice: null },
    '1m': { currentPrice: null, previousPrice: null },
    '1y': { currentPrice: null, previousPrice: null }
  });
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1h');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        // Fetch directly from Binance API
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        const newPrice = parseFloat(data.price);
        
        // Update price data for the current time period
        setPriceData(prev => ({
          ...prev,
          [selectedPeriod]: {
            previousPrice: prev[selectedPeriod].currentPrice,
            currentPrice: newPrice
          }
        }));
      } catch (error) {
        console.error('Error fetching BTC price:', error);
        toast({
          title: "Erro",
          description: "Não foi possível obter o preço do Bitcoin.",
          variant: "destructive",
        });
      }
    };

    const fetchWeather = async () => {
      try {
        // Using a valid API key for OpenWeatherMap
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Sao Paulo,br&units=metric&appid=4331036eb3b754b61040c7f1116dd796`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        toast({
          title: "Erro",
          description: "Não foi possível obter informações do clima.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBtcPrice();
    fetchWeather();

    // Set up interval for real-time updates of BTC price
    const btcInterval = setInterval(fetchBtcPrice, 10000); // Update every 10 seconds

    // Clean up interval on component unmount
    return () => {
      clearInterval(btcInterval);
    };
  }, [toast, selectedPeriod]);

  // Determine price trend
  const getPriceTrend = () => {
    const currentData = priceData[selectedPeriod];
    if (!currentData.previousPrice || !currentData.currentPrice) return 'neutral';
    return currentData.currentPrice > currentData.previousPrice ? 'up' : 
           currentData.currentPrice < currentData.previousPrice ? 'down' : 'neutral';
  };

  // Calculate percentage change
  const getPercentageChange = () => {
    const currentData = priceData[selectedPeriod];
    if (!currentData.previousPrice || !currentData.currentPrice) return null;
    
    const change = currentData.currentPrice - currentData.previousPrice;
    const percentChange = (change / currentData.previousPrice) * 100;
    
    return percentChange.toFixed(2);
  };

  const priceTrend = getPriceTrend();
  const percentChange = getPercentageChange();
  const currentPrice = priceData[selectedPeriod].currentPrice;

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  if (loading) {
    return (
      <div className="p-4 mb-4 bg-[#171717] rounded-lg animate-pulse">
        <div className="h-6 bg-[#222] rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-[#222] rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-4 bg-[#171717] rounded-lg border border-gray-800">
      <h2 className="text-xl font-medium text-white mb-3">Olá, bom dia!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`bg-[#1f1f1f] p-4 rounded-md transition-colors duration-500 ${
          priceTrend === 'up' ? 'bg-green-500/10' : 
          priceTrend === 'down' ? 'bg-red-500/10' : ''
        }`}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Bitcoin (BTC)</p>
            <div className="flex space-x-2">
              {(['1h', '7d', '1m', '1y'] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    selectedPeriod === period 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          {currentPrice ? (
            <div className="flex items-center">
              <div>
                <p className={`text-xl font-semibold transition-colors duration-500 ${
                  priceTrend === 'up' ? 'text-green-500 animate-fade-in' : 
                  priceTrend === 'down' ? 'text-red-500 animate-fade-in' : 'text-white'
                }`}>
                  ${currentPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {percentChange && (
                  <p className={`text-sm transition-colors duration-500 ${
                    priceTrend === 'up' ? 'text-green-500' : 
                    priceTrend === 'down' ? 'text-red-500' : 'text-white'
                  }`}>
                    {priceTrend === 'up' ? '+' : ''}{percentChange}%
                  </p>
                )}
              </div>
              {priceTrend === 'up' && (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500 animate-fade-in" />
              )}
              {priceTrend === 'down' && (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500 animate-fade-in" />
              )}
            </div>
          ) : (
            <p className="text-xl font-semibold text-white">Indisponível</p>
          )}
        </div>
        
        <div className="bg-[#1f1f1f] p-4 rounded-md">
          <p className="text-sm text-gray-400">Clima em {weatherData?.name || "São Paulo"}</p>
          {weatherData && weatherData.weather && weatherData.weather.length > 0 ? (
            <div className="flex items-center">
              {weatherData.weather[0]?.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
                  alt="Weather icon" 
                  className="w-10 h-10 mr-2"
                />
              )}
              <div>
                <p className="text-xl font-semibold text-white">{weatherData.main ? Math.round(weatherData.main.temp) : ''}°C</p>
                <p className="text-sm text-gray-300">{weatherData.weather[0]?.description || ""}</p>
              </div>
            </div>
          ) : (
            <p className="text-xl font-semibold text-white">Indisponível</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GreetingInfo;
