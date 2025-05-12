"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

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

export function VoiceSSRTableRow({
  voice,
  onSelect,
}: {
  voice: string;
  onSelect: (voice: string) => void;
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
    <TableRow>
      <TableCell className="w-1/4 text-center font-medium capitalize">
        {voice}
      </TableCell>
      <TableCell className="w-1/2 text-center">
        {audioUrl ? (
          <audio
            controls
            key={audioUrl} 
            onError={(e) =>
              console.error("Audio error:", e.currentTarget.error)
            }
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="text-gray-500">Loading audio...</div>
        )}
      </TableCell>
      <TableCell className="w-1/4 text-center">
        <Button
          onClick={() => onSelect(voice)}
          className="bg-green-500 hover:bg-green-400"
        >
          Pick
        </Button>
      </TableCell>
    </TableRow>
  );
}
