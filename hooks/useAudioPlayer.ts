// hooks/useAudioPlayer.ts
import { useState, useEffect, useRef } from "react";

export default function useAudioPlayer() {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, []);

  const playAudio = async () => {
    if (!audioRef.current || !audioSrc) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback failed:", error);
      setIsPlaying(false);
      return false;
    }
    return true;
  };

  return {
    audioRef,
    audioSrc,
    setAudioSrc,
    isPlaying,
    userInteracted,
    playAudio,
    setIsPlaying
  };
}