import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  WeatherDataPoint,
  CityWeather,
} from "@/components/dashboard/weather-service";

interface WeatherTableProps {
  weatherData: CityWeather[];
}

interface DailyWeatherData {
  date: string;
  forecast: WeatherDataPoint;
  avgTemp: number;
  maxTemp: number;
  minTemp: number;
  maxTime: string;
  minTime: string;
}

const groupByDay = (data: WeatherDataPoint[]): DailyWeatherData[] => {
  const grouped: Record<string, WeatherDataPoint[]> = {};

  data.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  return Object.entries(grouped)
    .map(([date, items]) => {
      const temps = items.map((item) => item.temp);
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const avgTemp = Math.round(
        temps.reduce((a, b) => a + b, 0) / temps.length
      );

      const maxTime =
        items
          .find((item) => item.temp === maxTemp)
          ?.dt_txt.split(" ")[1]
          .substring(0, 5) || "";
      const minTime =
        items
          .find((item) => item.temp === minTemp)
          ?.dt_txt.split(" ")[1]
          .substring(0, 5) || "";

      return {
        date,
        forecast: items[Math.floor(items.length / 2)] || items[0],
        avgTemp,
        maxTemp,
        minTemp,
        maxTime,
        minTime,
      };
    })
    .slice(0, 7);
};

const WeatherSummaryCards = ({
  dailyData,
}: {
  dailyData: DailyWeatherData[];
}) => {
  if (dailyData.length === 0) return null;

  const tomorrow = dailyData[1]; // Index 1 is tomorrow (index 0 is today)
  const allTemps = dailyData.flatMap((day) => [day.maxTemp, day.minTemp]);
  const weeklyMax = Math.max(...allTemps);
  const weeklyMin = Math.min(...allTemps);
  const weeklyAvg = Math.round(
    allTemps.reduce((a, b) => a + b, 0) / allTemps.length
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Max</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{weeklyMax}°C</div>
          <p className="text-sm text-muted-foreground">
            {dailyData.find((d) => d.maxTemp === weeklyMax)?.date} at{" "}
            {dailyData.find((d) => d.maxTemp === weeklyMax)?.maxTime}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Min</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{weeklyMin}°C</div>
          <p className="text-sm text-muted-foreground">
            {dailyData.find((d) => d.minTemp === weeklyMin)?.date} at{" "}
            {dailyData.find((d) => d.minTemp === weeklyMin)?.minTime}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Avg</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{weeklyAvg}°C</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tomorrow's Avg</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{tomorrow?.avgTemp}°C</div>
        </CardContent>
      </Card>
    </div>
  );
};

export function WeatherTable({ weatherData }: WeatherTableProps) {
  return (
    <div className="p-6">
      <Tabs defaultValue={weatherData[0]?.city || ""}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
          {weatherData.map((cityData) => (
            <TabsTrigger key={cityData.city} value={cityData.city}>
              {cityData.city}
            </TabsTrigger>
          ))}
        </TabsList>

        {weatherData.map((cityData) => {
          const dailyData = groupByDay(cityData.data);

          return (
            <TabsContent key={cityData.city} value={cityData.city}>
              <WeatherSummaryCards dailyData={dailyData} />

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-3/12">Date</TableHead>
                      <TableHead className="text-center w-2/12">Time</TableHead>
                      <TableHead className="text-center w-2/12">
                        Temp (°C)
                      </TableHead>
                      <TableHead className="text-center w-2/12">
                        Avg Daily Temp (°C)
                      </TableHead>
                      <TableHead className="w-1/12">Condition</TableHead>
                      <TableHead className="text-center w-2/12">
                        Description
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyData.map((day, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-center">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-center">
                          {day.forecast.dt_txt.split(" ")[1].substring(0, 8)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">
                            {day.forecast.temp}°C
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{day.avgTemp}°C</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center gap-2">
                            <img
                              src={day.forecast.weatherIcon}
                              alt={day.forecast.weatherMain}
                              className="h-8 w-8"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center capitalize">
                          {day.forecast.weatherMain.toLowerCase()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
