'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { Weather, WeeklyForecast } from '@/lib/types';

interface WeatherDisplayProps {
  weather: {
    current: Weather;
    weekly: WeeklyForecast[];
  };
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  if (!weather) return null;

  const { current, weekly } = weather;

  return (
    <div className="hidden md:flex items-center gap-4 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 text-white">
      <div className="flex items-center gap-3 pr-4 border-r border-white/20">
        <current.icon className="w-10 h-10" />
        <div>
          <p className="text-2xl font-bold">{current.temperature}°C</p>
          <p className="text-sm text-gray-300">{current.city}</p>
        </div>
      </div>
      <div className="flex gap-4">
        {weekly.slice(1, 5).map((forecast, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold">{forecast.day}</p>
            <forecast.icon className="w-6 h-6" />
            <p className="text-xs">{forecast.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
