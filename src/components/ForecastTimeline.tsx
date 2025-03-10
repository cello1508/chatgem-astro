
import React, { useEffect, useState } from 'react';
import { CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun, Cloud } from 'lucide-react';

interface ForecastDataPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  formattedTime: string;
}

interface ForecastTimelineProps {
  latitude: number;
  longitude: number;
}

const ForecastTimeline: React.FC<ForecastTimelineProps> = ({ latitude, longitude }) => {
  const [currentWeatherCode, setCurrentWeatherCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();
        
        if (data && data.hourly) {
          // Get current hour to determine current weather
          const currentHour = new Date().getHours();
          setCurrentWeatherCode(data.hourly.weather_code[currentHour]);
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        setError('Failed to load forecast data');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchForecastData();
    }
  }, [latitude, longitude]);

  const getWeatherGif = (code: number) => {
    // Clear sky
    if (code === 0) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTNhZ2JkdHQ3M3l0cnNxY2hmbThsaHlxNjU2cnczbngwOGVycWxhayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xkmQfH1TB0dLW/giphy.gif";
    }
    // Partly cloudy
    if (code >= 1 && code <= 3) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDA3ZjY2NnMxMG5tbmZmMzFmcXNnNnpndXVlcHJuMm5tZW5qdXV4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlQYOV7k3pB0ySI/giphy.gif";
    }
    // Fog
    if (code >= 45 && code <= 48) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGNkbzYybmt5MWN2NnR4dTA5YnRxb3RnZWJoaGdnOG1pcHoxeHVidiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYz2cD8rAYOmbYY/giphy.gif";
    }
    // Drizzle or light rain
    if (code >= 51 && code <= 57 || code >= 61 && code <= 65) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmRidndnbHk2MnBycnYwbzgycW1jaXMxZjQwZG5qbjRobXhicGEybCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/t7Qb8P0JmXiTe/giphy.gif";
    }
    // Snow
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTYxd2xnOXJxNXRiMGFubXFvMnBucnQ0c2ZoN3Qwa20xajB2bnhwbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IgfbnOHLNXLSo/giphy.gif";
    }
    // Heavy rain
    if (code >= 80 && code <= 82) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnhjemF0dDg2Z2duYW9jZnV2aTlmZDQ2bHNraHkzNTJqb2FrbW9mdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYAfGb5HlEqz7zi/giphy.gif";
    }
    // Thunderstorm
    if (code >= 95 && code <= 99) {
      return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjMzZThhMG5xdWtkcTZweHVwc3d6YzkwZmdiNGlmaTl2cXk3Z3IyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHB1EKuujDjYFWw/giphy.gif";
    }
    // Default partly cloudy
    return "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDA3ZjY2NnMxMG5tbmZmMzFmcXNnNnpndXVlcHJuMm5tZW5qdXV4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlQYOV7k3pB0ySI/giphy.gif";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-6 w-6 text-yellow-400" />;
    if (code >= 1 && code <= 3) return <CloudSun className="h-6 w-6 text-gray-400" />;
    if (code >= 45 && code <= 48) return <CloudFog className="h-6 w-6 text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="h-6 w-6 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-6 w-6 text-blue-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (code >= 85 && code <= 86) return <CloudSnow className="h-6 w-6 text-blue-300" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="h-6 w-6 text-yellow-500" />;
    return <Cloud className="h-6 w-6 text-gray-400" />;
  };

  const getWeatherDescription = (code: number): string => {
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
    return "Condições variáveis";
  };

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-3 w-full h-40">
        <div className="h-full w-full bg-gray-700/30 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-400 text-sm p-2">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full mt-2 flex flex-col items-center">
      {currentWeatherCode !== null && (
        <>
          <div className="flex items-center mb-2">
            {getWeatherIcon(currentWeatherCode)}
            <span className="ml-2 text-gray-300">{getWeatherDescription(currentWeatherCode)}</span>
          </div>
          <div className="w-full h-40 overflow-hidden rounded-md relative">
            <img 
              src={getWeatherGif(currentWeatherCode)} 
              alt={getWeatherDescription(currentWeatherCode)}
              className="w-full h-full object-cover" 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ForecastTimeline;
