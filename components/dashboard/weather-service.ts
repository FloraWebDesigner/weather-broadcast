import { Province } from "@prisma/client";

export interface WeatherDataPoint {
  dt_txt: string; 
  temp: number;   
  weatherMain: string; 
  weatherIcon?: string; 
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
}

export interface CityWeather {
  city: string;   
  data: WeatherDataPoint[]; 
}

export const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15);

export interface WeatherBroadcastInput {
  province: Province | string; // Make it accept both enum and string
  [key: string]: any; // Allow other properties
}

export async function fetchWeatherForecast(broadcasts: WeatherBroadcastInput[]): Promise<CityWeather[]> {

  const uniqueProvinces = Array.from(
    new Set(broadcasts.map(b => b.province))
  );

  const weatherPromises = uniqueProvinces.map(async (province) => {
    try {
      const formattedProvince = province.replace(/_/g, " ");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${formattedProvince}&units=metric&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER}`
      );
      
      if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
      
      const data = await response.json();
      
      const sevenDayForecast = data.list.slice(0, 56).map((item: any) => ({
        dt_txt: item.dt_txt,
        temp: Math.round(item.main.temp), 
        humidity:item.main.humidity,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        visibility: item.visibility,
        pressure: item.main.pressure,
        weatherMain: item.weather[0].description,
        weatherIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
      }));

      return {
        city: formattedProvince,
        data: sevenDayForecast
      };
    } catch (error) {
      console.error(`Failed to fetch weather for ${province}:`, error);
      return {
        city: province.replace(/_/g, " "),
        data: [] 
      };
    }
  });

  return Promise.all(weatherPromises);
}