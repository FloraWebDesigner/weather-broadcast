import type { WeatherDataPoint } from "@/components/dashboard/weather-service";

export interface Broadcast {
  id?: number;
  host: string;
  voice: string;
  province: string;
  date: Date;
  created_at?: Date;
}

export interface BroadcastWithWeather extends Broadcast {
  weather: WeatherDataPoint | null;
}

export async function getBroadcastsWithWeather(): Promise<
  BroadcastWithWeather[]
> {
  const res = await fetch("/api/broadcast");
  const provinceMap = (await res.json()) as Record<string, Broadcast[]>;

  return Object.values(provinceMap)
    .flat()
    .map((broadcast) => ({
      ...broadcast,
      weather: null,
    }));
}
