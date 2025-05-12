"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const randomPhrases = [
  "Hey neighbour! -20°C with wind chill today, eh? Double-check your car plug-in and pack that emergency kit!",
  "True Canadian alert! Fresh powder overnight - give yourself extra time to scrape the windshield!",
  "Oh sweet summer child! UV index 9 today at 28°C - sunscreen and hat are non-negotiable!",
  "Winter tire check! Black ice warning for the 401 corridor at -15°C - drive like you're carrying Tims for the team!",
  "Mosquito advisory! Humid 25°C today - the bugs are out in full force, eh? Don't forget your Off!",
  "Ice fog warning! -30°C in the Prairies - if your eyelashes freeze together, maybe stay in today!",
  "Heat wave alert! Sudbury hitting 32°C - hydrate like it's hockey playoffs!",
  "Spring thaw notice! Icy sidewalks at +3°C - walk like a newborn moose to avoid wipeouts!",
];

export function VoiceSSRCards({
  voice,
  onSelect,
  rotation = 0,
}: {
  voice: string;
  onSelect: (voice: string) => void;
  rotation?: number;
}) {
  const apiKey = process.env.NEXT_PUBLIC_RSS_KEY || process.env.RSS_KEY;
  const [randomPhrase, setRandomPhrase] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomPhrases.length);
    const phrase = randomPhrases[randomIndex];
    setRandomPhrase(phrase);

    if (apiKey && phrase) {
      const url = `https://api.voicerss.org/?key=${apiKey}&hl=en-us&v=${voice}&src=${encodeURIComponent(
        phrase
      )}`;
      setAudioUrl(url);
    }
  }, [apiKey, voice]);

  return (
     <motion.div
      initial={{ rotate: rotation }}
      className="w-full h-full rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)]"
      whileHover={{
        rotate: 0,
        scale: 1.05,
        zIndex: 10,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
      }}
    >
      <div className="flex flex-col items-center space-y-4 h-full">
        <motion.div 
          className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-200 dark:from-pink-900 dark:to-purple-900 overflow-hidden shadow-lg"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
          }}
        >
          <img
            src={`/${voice.toLowerCase()}.jpg`}
            alt={voice}
            className="w-full h-full object-cover shadow-inner"
          />
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold capitalize text-center text-gray-800 dark:text-white"
          whileHover={{ 
            scale: 1.05,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {voice}
        </motion.h3>
        
        <div className="w-full flex-1">
          {audioUrl ? (
            <audio
              controls
              key={audioUrl}
              className="w-full"
              onError={(e) => console.error("Audio error:", e.currentTarget.error)}
            >
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-gray-500 text-center">Loading audio...</div>
          )}
        </div>
        
        <motion.div
          whileHover={{ 
            scale: 1.05,
            filter: "drop-shadow(0 4px 6px rgba(79, 70, 229, 0.3))"
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-auto"
        >
          <Button
            onClick={() => onSelect(voice)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            Select Voice
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}