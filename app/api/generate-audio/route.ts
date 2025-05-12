import { PrismaClient } from "@prisma/client";
import { fetchWeatherForecast } from "@/components/dashboard/weather-service"
import { generateEnglishBroadcast } from "@/components/api-prompt"

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { broadcastId, force } = await req.json();

  const radio = await prisma.broadcast.findUnique({
    where: { id: broadcastId }
  });

  if (!radio) {
    return new Response('Not found', { status: 404 });
  }

  if (!force && radio.audioUrl) {
    return Response.json({ audioUrl: radio.audioUrl });
  }

  try {
    const weatherData = await fetchWeatherForecast([radio]);
    const cityWeather = weatherData.find(w => 
      w.city === radio.province.replace(/_/g, " ")
    );
    
    if (!cityWeather) {
      return new Response('Weather data not found', { status: 404 });
    }

    const text = generateEnglishBroadcast(
      cityWeather, 
      radio.host, 
      radio.date.toISOString()
    );
    const audioUrl = await generateAudio(text);

    await prisma.broadcast.update({
      where: { id: broadcastId },
      data: { 
        audioUrl,
        lastAudioUpdate: new Date() 
      }
    });

    return Response.json({ audioUrl });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : 'Audio generation failed',
      { status: 500 }
    );
  }
}


  async function generateAudio(text: string): Promise<string> {
    const apiKey = process.env.RSS_KEY || process.env.NEXT_PUBLIC_RSS_KEY;
    if (!apiKey) throw new Error("VoiceRSS API key missing");
  
    const audioResponse = await fetch(
      `https://api.voicerss.org/?key=${apiKey}&hl=en-us&src=${encodeURIComponent(text)}`
    );
  
    if (!audioResponse.ok) {
      throw new Error(`Audio generation failed (status ${audioResponse.status})`);
    }
  
    const audioBlob = await audioResponse.blob();
    return URL.createObjectURL(audioBlob);
  }