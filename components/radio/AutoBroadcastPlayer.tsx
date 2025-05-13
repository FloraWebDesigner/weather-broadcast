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
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
  const [isReadyForErrors, setIsReadyForErrors] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const showError = (message: string) => {
    if (!isReadyForErrors) return;
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    if (!broadcastsLoading && !weatherLoading) {
      const timer = setTimeout(() => {
        setIsReadyForErrors(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [broadcastsLoading, weatherLoading]);

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
            `https://api.voicerss.org/?key=${apiKey}&hl=en-us&v=${
              currentBroadcast.voice
            }&src=${encodeURIComponent(weatherReport)}`,
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
      {isReadyForErrors && error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <audio
        ref={audioRef}
        src={audioSrc || undefined}
        onCanPlay={handleCanPlay}
        onLoadedData={handleAudioLoaded}
        onCanPlayThrough={handleAudioLoaded}
        onEnded={() => {
          handleBroadcastEnded();
        }}
        onError={() => {
          showError("Audio playback failed");
          handleBroadcastEnded();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />

      <Button
        onClick={() => {
          if (audioReady) {
            if (isPlaying) {
              audioRef.current?.pause();
            } else {
              audioRef.current?.play().catch(console.error);
            }
          } else if (!audioLoading) {
            setCurrentIndex(currentIndex);
          }
        }}
        disabled={audioLoading}
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-1/5 text-white shadow-lg hover:shadow-2xl transition-shadow"
      >
        {audioLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating audio...
          </div>
        ) : isPlaying ? (
          "Pause"
        ) : (
          "Play Broadcast"
        )}
      </Button>

      <div className="relative w-full max-w-xs mx-auto h-64">
        <div className="absolute inset-0 flex flex-col items-center justify-start gap-1">
          <AnimatePresence initial={false}>
            {broadcasts.map((broadcast, index) => {
              const position = index - currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <motion.div
                  key={broadcast.id}
                  className="w-full px-4 py-1 text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    fontWeight: isCurrent ? 600 : 400,
                    fontSize: isCurrent ? "1.3rem" : "1rem",
                  }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    order: index,
                    zIndex: isCurrent ? 10 : 1,
                  }}
                >
                  <div>
                    <p
                      className={isCurrent ? "font-bold text-lg" : "text-base"}
                    >
                      {broadcast.host}
                    </p>
                    <p
                      className={
                        isCurrent ? "text-base" : "text-sm text-gray-500"
                      }
                    >
                      {new Date(broadcast.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}{" "}
                      • {broadcast.province.replace(/_/g, " ")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
