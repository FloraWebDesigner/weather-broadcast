import { CityWeather } from "./dashboard/weather-service";
import { WeatherDataPoint } from "./dashboard/weather-service";
// Helpers for English version
const getEnglishWindDirection = (degrees: number) => {
  const directions = [
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  return directions[Math.round(degrees / 45) % 8];
};

export const getEnglishGreeting = (hostName: string) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${greeting}, I'm ${hostName}. `;
};

export const generateEnglishBroadcast = (
  cityWeather: CityWeather,
  hostName: string,
  broadcastDate: string
): string => {
  if (!cityWeather?.data?.length) {
    return "Weather data not available";
  }

  const targetDate = broadcastDate ? new Date(broadcastDate) : new Date();


  const { noon, evening } = getDayPeriodWeather(cityWeather.data, targetDate);

  if (!noon || !evening) {
    return "Weather data not available for required times";
  }
  
  const current = noon; 
  const next6h = evening; 


  const dt_txt = current.dt_txt || new Date().toISOString();
  const weatherMain = current.weatherMain || "unknown conditions";
  const temp = current.temp ?? 0;

  try {
    const greeting = getEnglishGreeting(hostName);
    const currentTime = new Date(dt_txt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const windDir = getEnglishWindDirection(current.windDirection);
    const tempTrend = next6h.temp > current.temp ? "rising" : "falling";
    const visibilityDesc =
      current.visibility > 10000
        ? "excellent"
        : current.visibility > 5000
        ? "good"
        : "reduced";

    return `${greeting}! This is your weather update for ${
      cityWeather.city
    } as of ${currentTime}.

Currently, we're experiencing ${weatherMain} with temperatures at ${temp}°C. Winds are coming from the ${windDir} at ${
      current.windSpeed
    } meters per second, bringing ${
      current.humidity > 70 ? "humid" : "dry"
    } air across the region. 

Atmospheric pressure stands at ${
      current.pressure
    } hectopascals with ${visibilityDesc} visibility of approximately ${(
      current.visibility / 1000
    ).toFixed(1)} kilometers.

Looking ahead over the next 6 hours, temperatures will be ${tempTrend} to around ${
      next6h.temp
    }°C with ${
      next6h.weatherMain
    } developing. Winds will shift to come from the ${getEnglishWindDirection(
      next6h.windDirection
    )} later today.

Residents should ${
      current.temp < 10
        ? "dress warmly"
        : current.temp > 25
        ? "stay hydrated and use sunscreen"
        : "dress comfortably"
    } as these conditions continue. Our next update will be in 3 hours.`;
  } catch (error) {
    console.error("Error generating report:", error);
    return "Could not generate weather report";
  }
};


export const generateWeatherBroadcasts = (
  cityWeather: CityWeather,
  hostName: string,
  broadcastDate: string
) => {
  return {
    en: generateEnglishBroadcast(cityWeather, hostName,broadcastDate ),

  };
};


const getDayPeriodWeather = (data: CityWeather['data'], date: Date) => {
  const targetDateStr = date.toISOString().split('T')[0]; 
  const noonTime = `${targetDateStr} 12:00:00`;
  const noonWeather = data.find(item => item.dt_txt.includes(noonTime));

  const eveningTime = `${targetDateStr} 18:00:00`;
  const eveningWeather = data.find(item => item.dt_txt.includes(eveningTime));

  return {
    noon: noonWeather || null,
    evening: eveningWeather || null
  };
};