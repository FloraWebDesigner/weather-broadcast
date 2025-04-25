"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchWeatherForecast } from "./weather-service";
import { broadcast } from "@prisma/client";
import { format } from "date-fns/format";

interface WeatherChartProps {
  broadcasts: broadcast[];
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  [key: string]: any; // 其他动态属性
}

export function WeatherForecastChart({ broadcasts }: WeatherChartProps) {
  const [forecastData, setForecastData] = useState<
    { city: string; data: any[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWeatherForecast(broadcasts);
        setForecastData(data);
      } catch (error) {
        console.error("Failed to load weather data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (broadcasts.length > 0) {
      loadWeatherData();
    }
  }, [broadcasts]);

  const chartData: ChartDataPoint[] =
    forecastData.length > 0
      ? forecastData[0].data.map((item, index) => {
          const dataPoint: any = {
            date: item.dt_txt,
            fullDate: item.dt_txt,
          };
          forecastData.forEach((city) => {
            if (city.data[index]) {
              dataPoint[city.city] = city.data[index].temp;
              dataPoint[`${city.city}_icon`] = city.data[index].weatherIcon;
            }
          });
          return dataPoint;
        })
      : [];

  const generateXAxisTicks = (): string[] => {
    if (!chartData || chartData.length === 0) return [];

    const ticks: string[] = [];
    const daysToShow = 7;
    const allDataPoints = forecastData[0]?.data || [];

    if (allDataPoints.length === 0) return [];

    const firstTime = allDataPoints[0].dt_txt.split(" ")[1];
    const processedDates = new Set<string>();

    // 先收集所有符合条件的时间点
    for (const point of allDataPoints) {
      const [datePart, timePart] = point.dt_txt.split(" ");

      if (timePart === firstTime && !processedDates.has(datePart)) {
        ticks.push(point.dt_txt);
        processedDates.add(datePart);

        if (ticks.length >= daysToShow) break;
      }
    }

    const lastDayPoint = allDataPoints[allDataPoints.length - 1];
    const lastDate = lastDayPoint.dt_txt.split(" ")[0];

    if (!processedDates.has(lastDate)) {
      if (ticks.length < daysToShow) {
        ticks.push(lastDayPoint.dt_txt);
      } else {
        ticks[daysToShow - 1] = lastDayPoint.dt_txt;
      }
    }

    return ticks.slice(0, daysToShow);
  };

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  if (isLoading)
    return <div className="p-4 text-center">Loading weather data...</div>;
  if (forecastData.length === 0)
    return <div className="p-4 text-center">No weather data available</div>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>5-Day Temperature Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fullDate"
                ticks={generateXAxisTicks()}
                tickFormatter={(value) => {
                  if (!value) return "";
                  try {
                    const date = new Date(value);
                    return format(date, "MM/dd HH:mm");
                  } catch (error) {
                    const [datePart, timePart] = value.split(" ");
                    const [year, month, day] = datePart.split("-");
                    const [hour] = timePart.split(":");
                    return `${month}/${day} ${hour}:00`;
                  }
                }}
                tick={{
                  fontSize: 12,
                  dy: 20,
                  fill: "#666",
                }}
                height={100}
                interval={0}
                angle={0}
                minTickGap={20}
              />
              <YAxis
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value, name) => [`${value}°C`, name]}
                labelFormatter={(label) => {
                  if (!label) return "Unknown";
                  try {
                    const date = new Date(label);
                    return format(date, "MM/dd HH:mm");
                  } catch (error) {
                    try {
                      const [datePart, timePart] = label.split(" ");
                      const [year, month, day] = datePart.split("-");
                      const [hour, minute] = timePart.split(":");
                      return `${month}/${day} ${hour}:${minute}`;
                    } catch (e) {
                      return label;
                    }
                  }
                }}
                content={({ payload, label }) => (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="text-slate-400 text-center font-medium">
                      {label || "Unknown"}
                    </p>
                    {payload?.map((entry, idx) => (
                      <div key={idx} className="flex items-center">
                        <img
                          src={entry.payload[`${entry.name}_icon`] || ""}
                          alt=""
                          className="w-6 h-6 mr-2"
                        />
                        <span style={{ color: entry.color }}>
                          {entry.name}: {entry.value}°C
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Legend
                wrapperStyle={{
                  paddingBottom: "20px",
                  textAlign: "center",
                }}
                layout="horizontal"
                verticalAlign="top"
              />
              {forecastData.map((city, index) => (
                <Line
                  key={city.city}
                  type="monotone"
                  dataKey={city.city}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
