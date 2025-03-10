
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

const GreetingInfo: React.FC = () => {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [prevBtcPrice, setPrevBtcPrice] = useState<number | null>(null);
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
        
        setPrevBtcPrice(btcPrice); // Store previous price before updating
        setBtcPrice(newPrice);
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
  }, [toast, btcPrice]);

  // Determine price trend
  const getPriceTrend = () => {
    if (!prevBtcPrice || !btcPrice) return 'neutral';
    return btcPrice > prevBtcPrice ? 'up' : btcPrice < prevBtcPrice ? 'down' : 'neutral';
  };

  const priceTrend = getPriceTrend();

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
        <div className="bg-[#1f1f1f] p-4 rounded-md">
          <p className="text-sm text-gray-400">Bitcoin (BTC)</p>
          {btcPrice ? (
            <div className="flex items-center">
              <p className={`text-xl font-semibold ${
                priceTrend === 'up' ? 'text-green-500' : 
                priceTrend === 'down' ? 'text-red-500' : 'text-white'
              }`}>
                ${btcPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {priceTrend === 'up' && (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              )}
              {priceTrend === 'down' && (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
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
