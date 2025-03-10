
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, CloudOff, Plus, History, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GreetingInfoProps {
  onNewConversation?: () => void;
  onSelectModel?: (modelId: string) => void;
  selectedModel?: string;
}

const GreetingInfo: React.FC<GreetingInfoProps> = ({ 
  onNewConversation,
  onSelectModel,
  selectedModel = 'gpt-3.5-turbo'
}) => {
  const [priceData, setPriceData] = useState<Record<TimePeriod, PriceData>>({
    '1h': { currentPrice: null, previousPrice: null },
    '7d': { currentPrice: null, previousPrice: null },
    '1m': { currentPrice: null, previousPrice: null },
    '1y': { currentPrice: null, previousPrice: null }
  });
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1h');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMessageBeenSent, setHasMessageBeenSent] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setWeatherError(true);
          setLoading(false);
          toast({
            title: "Erro na localização",
            description: "Não foi possível obter sua localização.",
            variant: "destructive",
          });
        }
      );
    } else {
      setWeatherError(true);
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const handleMessageSent = () => {
      setHasMessageBeenSent(true);
    };

    window.addEventListener('messageSent', handleMessageSent);

    return () => {
      window.removeEventListener('messageSent', handleMessageSent);
    };
  }, []);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const data = await response.json();
        const newPrice = parseFloat(data.price);
        
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
      if (!userLocation) return;
      
      try {
        // Using a free weather API that doesn't require authentication
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Map the data from open-meteo to our WeatherData format
        const weatherInfo: WeatherData = {
          main: {
            temp: data.current.temperature_2m
          },
          weather: [{
            description: getWeatherDescription(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code)
          }],
          name: 'sua região'
        };
        
        setWeatherData(weatherInfo);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError(true);
        toast({
          title: "Erro",
          description: "Não foi possível obter informações do clima.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBtcPrice();
    if (userLocation) {
      fetchWeather();
    }

    const btcInterval = setInterval(fetchBtcPrice, 10000);
    return () => {
      clearInterval(btcInterval);
    };
  }, [toast, selectedPeriod, userLocation]);

  // Helper function to get weather description based on code
  const getWeatherDescription = (code: number): string => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (code === 0) return "Céu limpo";
    if (code >= 1 && code <= 3) return "Parcialmente nublado";
    if (code >= 45 && code <= 48) return "Nevoeiro";
    if (code >= 51 && code <= 55) return "Garoa";
    if (code >= 56 && code <= 57) return "Garoa congelante";
    if (code >= 61 && code <= 65) return "Chuva";
    if (code >= 66 && code <= 67) return "Chuva congelante";
    if (code >= 71 && code <= 75) return "Neve";
    if (code === 77) return "Granizo";
    if (code >= 80 && code <= 82) return "Chuva forte";
    if (code >= 85 && code <= 86) return "Neve forte";
    if (code >= 95 && code <= 99) return "Tempestade";
    return "Desconhecido";
  };

  // Helper function to get weather icon based on code
  const getWeatherIcon = (code: number): string => {
    // Map WMO codes to OpenWeatherMap icon codes for compatibility
    if (code === 0) return "01d"; // Clear sky
    if (code >= 1 && code <= 3) return "02d"; // Partly cloudy
    if (code >= 45 && code <= 48) return "50d"; // Fog
    if (code >= 51 && code <= 55) return "09d"; // Drizzle
    if (code >= 56 && code <= 57) return "09d"; // Freezing drizzle
    if (code >= 61 && code <= 65) return "10d"; // Rain
    if (code >= 66 && code <= 67) return "13d"; // Freezing rain
    if (code >= 71 && code <= 75) return "13d"; // Snow
    if (code === 77) return "13d"; // Snow grains
    if (code >= 80 && code <= 82) return "09d"; // Rain showers
    if (code >= 85 && code <= 86) return "13d"; // Snow showers
    if (code >= 95 && code <= 99) return "11d"; // Thunderstorm
    return "50d"; // Default
  };

  const getPriceTrend = () => {
    const currentData = priceData[selectedPeriod];
    if (!currentData.previousPrice || !currentData.currentPrice) return 'neutral';
    return currentData.currentPrice > currentData.previousPrice ? 'up' : 
           currentData.currentPrice < currentData.previousPrice ? 'down' : 'neutral';
  };

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

  const handleModelChange = (value: string) => {
    if (onSelectModel) {
      onSelectModel(value);
    }
  };

  if (loading && !weatherError) {
    return (
      <div className="p-4 mb-4 bg-[#171717] rounded-lg animate-pulse">
        <div className="h-6 bg-[#222] rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-[#222] rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-4 bg-[#171717] rounded-lg border border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className={`bg-[#1f1f1f] p-4 rounded-md transition-colors duration-500 ${
          hasMessageBeenSent && priceTrend === 'up' ? 'bg-green-500/10' : 
          hasMessageBeenSent && priceTrend === 'down' ? 'bg-red-500/10' : ''
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
                  hasMessageBeenSent && priceTrend === 'up' ? 'text-green-500 animate-fade-in' : 
                  hasMessageBeenSent && priceTrend === 'down' ? 'text-red-500 animate-fade-in' : 'text-white'
                }`}>
                  ${currentPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {percentChange && (
                  <p className={`text-sm transition-colors duration-500 ${
                    hasMessageBeenSent && priceTrend === 'up' ? 'text-green-500' : 
                    hasMessageBeenSent && priceTrend === 'down' ? 'text-red-500' : 'text-white'
                  }`}>
                    {priceTrend === 'up' ? '+' : ''}{percentChange}%
                  </p>
                )}
              </div>
              {hasMessageBeenSent && priceTrend === 'up' && (
                <TrendingUp className="ml-2 h-5 w-5 text-green-500 animate-fade-in" />
              )}
              {hasMessageBeenSent && priceTrend === 'down' && (
                <TrendingDown className="ml-2 h-5 w-5 text-red-500 animate-fade-in" />
              )}
            </div>
          ) : (
            <p className="text-xl font-semibold text-white">Indisponível</p>
          )}
        </div>
        
        <div className="bg-[#1f1f1f] p-4 rounded-md">
          <p className="text-sm text-gray-400">Clima em {weatherData?.name || "sua região"}</p>
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
            <div className="flex items-center text-gray-400">
              <CloudOff className="w-8 h-8 mr-2" />
              <div>
                <p className="text-lg font-medium">Informações de clima indisponíveis</p>
                <p className="text-sm">Não foi possível obter dados meteorológicos</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Centered model selection and conversation controls */}
      <div className="flex flex-col items-center mt-6 space-y-3">
        <div className="w-full max-w-md">
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full bg-[#1f1f1f] border-gray-700">
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent className="bg-[#1f1f1f] border-gray-700 text-white">
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <button
          onClick={onNewConversation}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors w-full max-w-md"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Conversa</span>
        </button>
        
        <Collapsible 
          open={isHistoryOpen} 
          onOpenChange={setIsHistoryOpen}
          className="w-full max-w-md bg-[#1f1f1f] rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="flex justify-between items-center w-full p-3 text-left bg-[#1f1f1f] hover:bg-[#2a2a2a] border-t border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 text-gray-400" />
              <span>Histórico de Conversas</span>
            </div>
            {isHistoryOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2 max-h-48 overflow-y-auto scrollbar-thin">
            <div className="space-y-1">
              {/* Placeholder for conversation history items */}
              <div className="p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <p className="text-sm truncate">Como usar o GPT para pesquisa</p>
                <p className="text-xs text-gray-400">Ontem</p>
              </div>
              <div className="p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <p className="text-sm truncate">Ajuda com código React</p>
                <p className="text-xs text-gray-400">3 dias atrás</p>
              </div>
              <div className="p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <p className="text-sm truncate">Ideias para projeto de IA</p>
                <p className="text-xs text-gray-400">5 dias atrás</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default GreetingInfo;
