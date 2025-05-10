"use client";

import { useEffect, useRef, useState } from "react";

interface Broadcast {
  id: number;
  host: string;
  voice: string;
  province: string;
  date: string;
  created_at: string;
}

export default function AutoBroadcastPlayer() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. get broadcasts from API
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await fetch("/api/broadcast");
        const data: Broadcast[] = await response.json();
        setBroadcasts(data);
      } catch (error) {
        console.error("Fail to get api data:", error);
      }
    };
    fetchBroadcasts();
  }, []);

  // user interaction detection
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, []);

  // 3. generate audio URL
  useEffect(() => {
    if (broadcasts.length > 0 && currentIndex < broadcasts.length) {
      const currentBroadcast = broadcasts[currentIndex];
      const weatherPrompt = `${currentBroadcast.host}, ${currentBroadcast.voice}, ${currentBroadcast.province}, ${currentBroadcast.date}`;
      const apiKey = process.env.NEXT_PUBLIC_RSS_KEY || process.env.RSS_KEY;

      if (!apiKey) {
        console.error("VoiceRSS API key is missing");
        return;
      }

      const urlAudio = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(
        weatherPrompt
      )}`;
      setAudioSrc(urlAudio);
    }
  }, [currentIndex, broadcasts]);

  // 4. audio play control
  useEffect(() => {
    if (!userInteracted || !audioSrc || !audioRef.current) return;

    const playAudio = async () => {
      try {
        await audioRef.current!.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Failed to play:", error);
        setIsPlaying(false);
        // automatically handle the end of the broadcast
        handleBroadcastEnded();
      }
    };

    playAudio();
  }, [audioSrc, userInteracted]);

  // 5. deal with audio end event
  const handleBroadcastEnded = () => {
    setIsPlaying(false);

    // play next broadcast
    if (broadcasts.length > 0) {
      setCurrentIndex((prev) => (prev < broadcasts.length - 1 ? prev + 1 : 0));
    }
  };

  // 6. current broadcast info
  const currentBroadcast = broadcasts[currentIndex] || null;
  const progress =
    broadcasts.length > 0
      ? `${currentIndex + 1}/${broadcasts.length}`
      : "loading...";

  return (
    <div className="broadcast-player">
      {currentBroadcast && (
        <div className="broadcast-info">
          <h3>{currentBroadcast.province}Weather Boardcast</h3>
          <p>
            Host: {currentBroadcast.host} | Date: {currentBroadcast.date}
          </p>
        </div>
      )}

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          controls
          onEnded={handleBroadcastEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          hidden={!userInteracted} // hidd audio controls until user interacts
        />
      )}

      <div className="player-status">
        <p>
          Status: {isPlaying ? "Play" : "Pause"} | Progress: {progress}
        </p>
        {!userInteracted && (
          <p className="interaction-hint">
            Click anywhere on the page to activate playback
          </p>
        )}
      </div>
    </div>
  );
}
