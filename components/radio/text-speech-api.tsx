"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { generateWeatherBroadcasts } from "../api-prompt";
import type { CityWeather } from "@/components/dashboard/weather-service";

type Language = "en" | "fr" | "zh";

interface TextToSpeechProps {
  selectedLanguage: Language;
  cityWeather?: CityWeather;
}

export default function TextToSpeech({
  selectedLanguage = "en",
  cityWeather
}: TextToSpeechProps) {
  const [isReady, setIsReady] = useState(false);

  const broadcasts = cityWeather 
    ? generateWeatherBroadcasts(cityWeather)
    : { en: "No data", fr: "Pas de données", zh: "无数据" };

  const speak = () => {
    if (!isReady) return;
    
    const utterance = new SpeechSynthesisUtterance(broadcasts[selectedLanguage]);
    utterance.lang = selectedLanguage === "zh" ? "zh-CN" : `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
    
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.lang.includes(utterance.lang)) || voices[0];
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <Button onClick={speak} disabled={!isReady}>
        Play {selectedLanguage.toUpperCase()} Report
      </Button>
      <div className="p-4 bg-gray-50 rounded-md">
        <pre className="whitespace-pre-wrap">{broadcasts[selectedLanguage]}</pre>
      </div>
    </div>
  );
}