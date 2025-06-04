'use client'
import Step from "@/components/step";
import AutoBroadcastPlayer from "@/components/radio/AutoBroadcastPlayer";
import Particles from "react-tsparticles";
import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export default function RadioPage() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative min-h-screen">
      <Particles
        init={particlesInit}
        options={{
          background: {
            color: "#000000", 
          },
          particles: {
            number: {
              value: 80, 
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#FFFFFF", 
            },
            shape: {
              type: "circle", 
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: true,
            },
            move: {
              enable: true,
              speed: 1, 
              direction: "none",
              out_mode: "out",
            },
            line_linked: {
              enable: false, 
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse", 
              },
            },
          },
        }}
        className="absolute inset-0 -z-10" 
      />

      <div className="relative z-10">
        {" "}
        <Step title="Welcome to Weather Broadcast" value={100} label="✓" />
        <AutoBroadcastPlayer />
      </div>
    </div>
  );
}
