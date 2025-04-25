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
import { PdfExportButton } from "@/components/dashboard/PdfExportButton";

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
  const baseTime = data[0].dt_txt.split(" ")[1];
  const uniqueDates = new Set<string>();

  data.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    uniqueDates.add(date);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });

  const sortedDates = Array.from(uniqueDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return sortedDates
    .map((date) => {
      const items = grouped[date];
      const temps = items.map((item) => item.temp);
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const avgTemp = Math.round(
        temps.reduce((a, b) => a + b, 0) / temps.length
      );

      const representativeItem =
        items.find((item) => item.dt_txt.split(" ")[1] === baseTime) ||
        items[0];

      return {
        date,
        forecast: representativeItem,
        avgTemp,
        maxTemp,
        minTemp,
        maxTime:
          items
            .find((item) => item.temp === maxTemp)
            ?.dt_txt.split(" ")[1]
            .substring(0, 5) || "",
        minTime:
          items
            .find((item) => item.temp === minTemp)
            ?.dt_txt.split(" ")[1]
            .substring(0, 5) || "",
      };
    })
    .slice(0, 5);
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
              <div className="text-right mb-4">
                <PdfExportButton weatherData={weatherData} />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="text-center">Temp (°C)</TableHead>
                      <TableHead className="text-center">
                        Humidity (%)
                      </TableHead>
                      <TableHead className="text-center">
                        Wind Speed (m/s)
                      </TableHead>
                      <TableHead className="text-center">
                        Wind Direction
                      </TableHead>
                      <TableHead className="text-center">
                        Visibility (m)
                      </TableHead>
                      <TableHead className="text-center">
                        Pressure (hPa)
                      </TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cityData.data.map((point, idx) => {
                      const [dateStr, timeStr] = point.dt_txt.split(" ");
                      return (
                        <TableRow key={idx}>
                          <TableCell className="text-center">
                            {dateStr}
                          </TableCell>
                          <TableCell className="text-center">
                            {timeStr.substring(0, 5)}
                          </TableCell>
                          <TableCell className="text-center">
                            {point.temp}°C
                          </TableCell>
                          <TableCell className="text-center">
                            {point.humidity}%
                          </TableCell>
                          <TableCell className="text-center">
                            {point.windSpeed} m/s
                          </TableCell>
                          <TableCell className="text-center">
                            {point.windDirection}°
                          </TableCell>
                          <TableCell className="text-center">
                            {point.visibility} m
                          </TableCell>
                          <TableCell className="text-center">
                            {point.pressure} hPa
                          </TableCell>
                          <TableCell>{point.weatherMain}</TableCell>
                          <TableCell>
                            {" "}
                            <img
                              src={point.weatherIcon}
                              alt={point.weatherMain}
                              className="h-8 w-8"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
