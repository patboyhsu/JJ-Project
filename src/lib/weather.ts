import { Sun, Cloudy, CloudRain, Snowflake, Wind, Zap, SunIcon } from 'lucide-react';
import type { Weather, WeeklyForecast } from './types';

const iconMap = {
  Sunny: Sun,
  Cloudy: Cloudy,
  Rainy: CloudRain,
  Snowy: Snowflake,
  Windy: Wind,
  Thunderstorm: Zap,
};

const currentToken = new Date().getTime();

const MOCK_CURRENT_WEATHER: Weather = {
  city: 'Taipei',
  temperature: 28,
  condition: 'Sunny',
  icon: Sun,
};

const MOCK_WEEKLY_FORECAST: WeeklyForecast[] = [
  { day: 'Mon', condition: 'Sunny', temp: '28°', icon: Sun },
  { day: 'Tue', condition: 'Cloudy', temp: '26°', icon: Cloudy },
  { day: 'Wed', condition: 'Rainy', temp: '24°', icon: CloudRain },
  { day: 'Thu', condition: 'Rainy', temp: '23°', icon: CloudRain },
  { day: 'Fri', condition: 'Thunderstorm', temp: '22°', icon: Zap },
  { day: 'Sat', condition: 'Cloudy', temp: '25°', icon: Cloudy },
  { day: 'Sun', condition: 'Sunny', temp: '29°', icon: Sun },
];

// Function to get a semi-random weather pattern to demonstrate app changes
const getWeatherForToday = (): { current: Weather, weekly: WeeklyForecast[] } => {
    const dayOfWeek = new Date().getDay(); // 0 for Sunday, 1 for Monday...
    const forecastToday = MOCK_WEEKLY_FORECAST[(dayOfWeek + 6) % 7]; // Adjust to make Monday the start

    const current: Weather = {
        city: 'Taipei',
        temperature: parseInt(forecastToday.temp),
        condition: forecastToday.condition,
        icon: forecastToday.icon,
    };
    
    // Rotate weekly forecast to start from today
    const weekly = [...Array(7)].map((_, i) => {
        const dayIndex = (dayOfWeek -1 + i + 7) % 7;
        const originalDay = MOCK_WEEKLY_FORECAST[dayIndex];
        return {
            ...originalDay,
            day: i === 0 ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() + i) % 7],
        }
    });

    return { current, weekly };
};


export const useMockWeather = () => {
    return getWeatherForToday();
};
