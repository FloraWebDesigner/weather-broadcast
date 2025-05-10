import { broadcast } from ".prisma/client";;

// lib/audioPreload.ts
export async function checkAndPreloadAudios(
    radios: broadcast[],
    options: {
      forceRefresh: (radio: broadcast) => boolean;
      onProgress?: (progress: number) => void;
    }
  ) {
    const total = radios.length;
    let processed = 0;
  
    const processRadio = async (radio: broadcast) => {
      try {
        const shouldRefresh = options.forceRefresh(radio);
        
        let audioUrl = radio.audioUrl;
        if (shouldRefresh || !audioUrl) {

          const response = await fetch('/api/generate-audio', {
            method: 'POST',
            body: JSON.stringify({
              broadcastId: radio.id,
              force: shouldRefresh
            })
          });
          const data = await response.json();
          audioUrl = data.audioUrl;
        }

        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.preload = 'auto';
          await new Promise((resolve) => {
            audio.addEventListener('loadeddata', resolve);
            audio.addEventListener('error', resolve);
          });
        }
  
        processed++;
        options.onProgress?.(Math.round((processed / total) * 100));
      } catch (error) {
        console.error(`Failed to preload ${radio.id}:`, error);
      }
    };

    const BATCH_SIZE = 3;
    for (let i = 0; i < radios.length; i += BATCH_SIZE) {
      const batch = radios.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(processRadio));
    }
  }