"use client";
import useBroadcasts from "@/hooks/useBroadcasts";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { generateEnglishBroadcast } from "@/components/api-prompt";
import {
  fetchWeatherForecast,
  CityWeather,
} from "../dashboard/weather-service";

export default function AutoBroadcastPlayer() {
  const {
    broadcasts,
    loading: broadcastsLoading,
    error: broadcastsError,
  } = useBroadcasts();
  const {
    audioRef,
    audioSrc,
    setAudioSrc,
    isPlaying,
    setIsPlaying,
    userInteracted,
  } = useAudioPlayer();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [weatherForecasts, setWeatherForecasts] = useState<CityWeather[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Fetch weather data when broadcasts are loaded
  useEffect(() => {
    if (broadcasts.length > 0) {
      const loadWeatherData = async () => {
        setWeatherLoading(true);
        try {
          const forecasts = await fetchWeatherForecast(broadcasts);
          setWeatherForecasts(forecasts);
        } catch {
          showError("Failed to fetch weather data");
        } finally {
          setWeatherLoading(false);
        }
      };
      loadWeatherData();
    }
  }, [broadcasts]);

  useEffect(() => {
    if (!broadcastsLoading && !weatherLoading) {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [broadcastsLoading, weatherLoading]);

  // Generate audio prompt when data is available
  useEffect(() => {
    if (
      broadcasts.length > 0 &&
      currentIndex < broadcasts.length &&
      weatherForecasts.length > 0 &&
      !weatherLoading
    ) {
      const currentBroadcast = broadcasts[currentIndex];
      const cityWeather = weatherForecasts.find(
        (w) => w.city === currentBroadcast.province.replace(/_/g, " ")
      );

      if (!cityWeather) {
        showError(`No weather data found for ${currentBroadcast.province}`);
        return;
      }

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const generateAndLoadAudio = async () => {
        setAudioLoading(true);
        setAudioReady(false);

        try {
          const weatherReport = generateEnglishBroadcast(
            cityWeather,
            currentBroadcast.host,
            currentBroadcast.date
          );

          const apiKey = process.env.NEXT_PUBLIC_RSS_KEY || process.env.RSS_KEY;
          if (!apiKey) {
            showError("VoiceRSS API key is missing");
            return;
          }

          const response = await fetch(
            `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(
              weatherReport
            )}`,
            {
              signal: abortControllerRef.current?.signal,
            }
          );

          if (!response.ok) {
            showError(`Audio generation failed (status ${response.status})`);
            return;
          }

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioSrc(audioUrl);
          setAudioReady(true);
        } catch {
          showError("Audio generation failed");
        } finally {
          setAudioLoading(false);
        }
      };

      generateAndLoadAudio();

      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
  }, [currentIndex, broadcasts, weatherForecasts, weatherLoading, setAudioSrc]);

  const handleBroadcastEnded = () => {
    setIsPlaying(false);
    setAudioReady(false);
    if (broadcasts.length > 0) {
      setTimeout(() => {
        setCurrentIndex((prev) =>
          prev < broadcasts.length - 1 ? prev + 1 : 0
        );
      }, 300);
    }
  };

  const handleCanPlay = () => {
    if (userInteracted && isPlaying) {
      audioRef.current?.play().catch((err) => {
        console.error("Play error:", err);
        handleBroadcastEnded();
      });
    }
  };

  const handleAudioLoaded = () => {
    if (userInteracted && audioSrc && audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Play error:", err);
        handleBroadcastEnded();
      });
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (broadcastsLoading || weatherLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              Now playing: {broadcasts[currentIndex].host}'s broadcast
            </h2>
            {audioLoading && (
              <p className="text-sm text-muted-foreground mt-2">
                Generating audio...
              </p>
            )}
          </div>

          <audio
            ref={audioRef}
            src={audioSrc || undefined}
            controls
            onCanPlay={handleCanPlay}
            onLoadedData={handleAudioLoaded}
            onCanPlayThrough={handleAudioLoaded}
            onEnded={handleBroadcastEnded}
            onError={() => {
              showError("Audio playback failed");
              handleBroadcastEnded();
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            hidden={!userInteracted || !audioReady}
          />
        </>
      )}
    </div>
  );
}
