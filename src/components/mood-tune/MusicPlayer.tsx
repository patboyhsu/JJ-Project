'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MusicPlayerProps {
  playlist: string[];
}

function extractYouTubeID(url: string): string | null {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) return videoId;
        }
    } catch (e) {
        // Not a valid URL, maybe it's just an ID
        if (url.length === 11 && !url.includes(' ')) return url;
    }
    // Fallback for just ID
    if (url.length === 11 && !url.includes(' ')) return url;
    return null;
}

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [videoIds, setVideoIds] = useState<(string | null)[]>([]);

  useEffect(() => {
    setVideoIds(playlist.map(extractYouTubeID));
  }, [playlist]);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const currentVideoId = videoIds[current];

  return (
    <Card className="bg-card/30 backdrop-blur-lg border-white/10 text-white animate-in fade-in slide-in-from-bottom-10 duration-500">
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/3 lg:w-1/4">
          {currentVideoId ? (
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=0&modestbranding=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </AspectRatio>
          ) : (
             <AspectRatio ratio={16/9} className="bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Invalid Video</p>
             </AspectRatio>
          )}
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {videoIds.map((id, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className={cn("bg-black/20 border-white/10", current === index && "border-primary")}>
                      <CardContent className="flex flex-col items-center justify-center p-2 gap-2">
                        <img
                          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                          alt={`Thumbnail for video ${index + 1}`}
                          className="rounded-sm w-full"
                          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/error/320/180')}
                        />
                         <p className="text-xs text-center text-muted-foreground truncate w-full">Track {index + 1}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white bg-black/30 hover:bg-black/50 border-white/20 hover:text-white" />
            <CarouselNext className="text-white bg-black/30 hover:bg-black/50 border-white/20 hover:text-white" />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
}
