"use client";

import { SetStateAction, useState } from "react";
import addVoice from "@app/actions/addVoice";

export function AIVoice({ hostId }) {
  const [selectedVoice, setSelectedVoice] = useState("");

  const voices = [
    "alloy",
    "ash",
    "coral",
    "echo",
    "fable",
    "onyx",
    "nova",
    "sage",
    "shimmer",
  ];

  async function handleVoiceSelect(voice: SetStateAction<string>) {
    setSelectedVoice(voice); // Update UI immediately

    await addVoice(hostId, voice); // Call the server action
  }

  return (
    <div className="w-1/2 mx-auto border border-slate-500 p-5">
      {voices.map((voice) => (
        <div key={voice} className="flex flex-row gap-3 items-center">
          <p className="text-center font-medium">{voice}</p>
          <audio
            src={`https://cdn.openai.com/API/docs/audio/${voice}.wav`}
            className="w-full h-10"
            controls
          ></audio>
          <form action={() => handleVoiceSelect(voice)}>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                selectedVoice === voice ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {selectedVoice === voice ? "Selected" : "Select"}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
