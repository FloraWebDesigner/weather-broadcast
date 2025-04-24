import Step from "@/components/step";
import { PrismaClient } from "@prisma/client";
import { WeatherForecastChart } from "@/components/dashboard/weather-chart";
import { WeatherTable } from "@/components/dashboard/weather-table";
import { fetchWeatherForecast } from "@/components/dashboard/weather-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Dashboard() {
  const prisma = new PrismaClient();
  const broadcasts = await prisma.broadcast.findMany();
  const weatherData = await fetchWeatherForecast(broadcasts);

  return (
    <>
      <Step title="Welcome to Weather Broadcast" value={100} label="✓" />
      <div>
        <WeatherForecastChart broadcasts={broadcasts} />
      </div>
      <div>
        <Suspense fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        }>
          <WeatherTable weatherData={weatherData} />
        </Suspense>
      </div>
    </>
  );
}