
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning } from 'lucide-react';

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
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
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
          // Get current hour to show forecast from now onwards
          const currentHour = new Date().getHours();
          
          // Format the data for the chart - showing 24 hours
          const formattedData = data.hourly.time
            .slice(currentHour, currentHour + 24) // Get next 24 hours from current hour
            .map((time: string, index: number) => {
              const timeDate = new Date(time);
              return {
                time: time,
                temperature: data.hourly.temperature_2m[currentHour + index],
                weatherCode: data.hourly.weather_code[currentHour + index],
                formattedTime: timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            });

          setForecastData(formattedData);
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

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-4 w-4 text-yellow-400" />;
    if (code >= 1 && code <= 3) return <CloudSun className="h-4 w-4 text-gray-400" />;
    if (code >= 45 && code <= 48) return <CloudFog className="h-4 w-4 text-gray-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="h-4 w-4 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-4 w-4 text-blue-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="h-4 w-4 text-blue-500" />;
    if (code >= 85 && code <= 86) return <CloudSnow className="h-4 w-4 text-blue-300" />;
    if (code >= 95 && code <= 99) return <CloudLightning className="h-4 w-4 text-yellow-500" />;
    return <Cloud className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-3 w-full h-24">
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#222] border border-gray-700 rounded-md p-2 text-sm">
          <p className="text-white">{data.formattedTime}</p>
          <p className="text-blue-400">{`${data.temperature}°C`}</p>
          <div className="flex items-center mt-1">
            {getWeatherIcon(data.weatherCode)}
          </div>
        </div>
      );
    }
    return null;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Cloudy";
  };

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-200 mb-2">24-Hour Weather Forecast</h3>
      <div className="w-full h-32 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="formattedTime" 
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
              tickFormatter={(value) => `${Math.round(value)}°C`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              payload={[{ value: 'Temperature (°C)', type: 'line', color: '#33C3F0' }]}
              verticalAlign="top"
              height={20}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#33C3F0" 
              strokeWidth={2}
              dot={(props) => {
                if (!props || !props.payload) return null;
                const weatherCode = props.payload.weatherCode;
                return (
                  <g transform={`translate(${props.cx},${props.cy})`} key={props.index}>
                    <circle r={4} fill="#33C3F0" />
                    <foreignObject width="12" height="12" x="-6" y="-6">
                      <div className="flex items-center justify-center">
                        {getWeatherIcon(weatherCode)}
                      </div>
                    </foreignObject>
                  </g>
                );
              }}
              activeDot={{ r: 6, fill: '#33C3F0', stroke: '#1c1c1c', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {forecastData.length > 0 && (
        <div className="flex flex-row flex-wrap mt-3 gap-2">
          {forecastData.filter((_, i) => i % 4 === 0).map((data, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-800/50 rounded-md p-2">
              <div className="text-xs text-gray-400">{data.formattedTime}</div>
              <div className="mt-1">{getWeatherIcon(data.weatherCode)}</div>
              <div className="text-xs mt-1 text-blue-400">{data.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-gray-500">{getWeatherDescription(data.weatherCode)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastTimeline;
