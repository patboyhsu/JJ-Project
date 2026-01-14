'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"
import type { UserPreferences, MusicRecommendation } from '@/lib/types';
import { useMockWeather } from '@/lib/weather';
import { getRecommendations } from '@/app/actions';
import { InitialSetup } from './InitialSetup';
import { WeatherDisplay } from './WeatherDisplay';
import { MusicPlayer } from './MusicPlayer';
import { Settings, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppContainer() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBgLoading, setIsBgLoading] = useState(true);

  const { toast } = useToast();
  const weatherData = useMockWeather();

  useEffect(() => {
    const storedPrefs = localStorage.getItem('moodTune-preferences');
    if (storedPrefs) {
      setPrefs(JSON.parse(storedPrefs));
    } else {
      setShowSetup(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (prefs && weatherData) {
      setIsLoading(true);
      getRecommendations(prefs, weatherData.current.condition)
        .then(res => {
          if ('error' in res) {
            toast({
              variant: "destructive",
              title: "Recommendation Error",
              description: res.error,
            });
            setRecommendations(null);
          } else {
            setIsBgLoading(true);
            setRecommendations(res);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [prefs, weatherData, toast]);

  const handleSetupFinished = (newPrefs: UserPreferences) => {
    localStorage.setItem('moodTune-preferences', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setShowSetup(false);
  };
  
  const backgroundStyle = recommendations?.backgroundImageUrl ? { backgroundImage: `url(${recommendations.backgroundImageUrl})` } : {};

  return (
    <>
      <div 
        className="fixed inset-0 bg-background bg-cover bg-center transition-all duration-1000"
        style={backgroundStyle}
        onLoad={() => setIsBgLoading(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex h-screen w-full flex-col p-4 sm:p-6 md:p-8">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-white shadow-md font-headline">MoodTune</h1>
            <div className="flex items-center gap-4">
              <WeatherDisplay weather={weatherData} />
              <Button variant="ghost" size="icon" onClick={() => setShowSetup(true)} className="text-white hover:bg-white/20 hover:text-white">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
            {isLoading && (
                <div className="flex flex-col items-center gap-4 text-white">
                    <LoaderCircle className="h-12 w-12 animate-spin"/>
                    <p className="text-lg">Tuning your mood...</p>
                </div>
            )}
        </main>

        <footer className="w-full">
            {!isLoading && recommendations && (
                <MusicPlayer key={recommendations.playlist.join('-')} playlist={recommendations.playlist} />
            )}
        </footer>
      </div>

      <InitialSetup
        isOpen={showSetup}
        onClose={() => { if(prefs) setShowSetup(false)}}
        onFinished={handleSetupFinished}
        currentPrefs={prefs}
      />
    </>
  );
}
