'use server';

import { recommendMusicPlaylists } from '@/ai/flows/recommend-music-playlists';
import { generateBackgroundImage } from '@/ai/flows/dynamic-background-image';
import type { UserPreferences } from '@/lib/types';
import { MusicRecommendation } from '@/lib/types';

function getWeatherMood(weather: string): string {
  const lowerWeather = weather.toLowerCase();
  if (lowerWeather.includes('sun') || lowerWeather.includes('cloud') || lowerWeather.includes('wind')) {
    return 'Joyful, light, relaxed, sunny';
  }
  if (lowerWeather.includes('rain')) {
      if (lowerWeather.includes('heavy') || lowerWeather.includes('thunder')) {
        return 'Dramatic, passionate, mysterious';
      }
      return 'Lazy, calm, melancholic, introspective';
  }
  if (lowerWeather.includes('snow')) {
    return 'Serene, warm, romantic';
  }
  return 'Calm';
}

export async function getRecommendations(
  preferences: UserPreferences,
  weather: string
): Promise<MusicRecommendation | { error: string }> {
  try {
    const weatherMood = getWeatherMood(weather);

    // The AI flow for personality requires a string, not an array.
    const personalityString = preferences.personality.join(', ');

    // Call both flows in parallel for efficiency
    const [musicResult, imageResult] = await Promise.all([
      recommendMusicPlaylists({
        weather: weather,
        gender: preferences.gender,
        personality: preferences.personality,
      }),
      generateBackgroundImage({
        weatherMood: weatherMood,
        gender: preferences.gender,
        personality: personalityString,
      }),
    ]);

    if (!musicResult?.playlist || !imageResult?.imageUrl) {
        throw new Error('Failed to get recommendations from AI. The results were empty.');
    }

    return {
      playlist: musicResult.playlist,
      backgroundImageUrl: imageResult.imageUrl,
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      error: 'Could not fetch recommendations at this time. Please try again later.',
    };
  }
}
