export type UserPreferences = {
  gender: 'male' | 'female' | 'non-binary';
  personality: string[];
};

export type Weather = {
  city: string;
  temperature: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy' | 'Thunderstorm';
  icon: React.ComponentType<{ className?: string }>;
};

export type WeeklyForecast = {
  day: string;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy' | 'Windy' | 'Thunderstorm';
  temp: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type MusicRecommendation = {
  playlist: string[];
  backgroundImageUrl: string;
};
