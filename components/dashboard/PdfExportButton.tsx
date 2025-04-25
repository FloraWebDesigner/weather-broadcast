"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  WeatherDataPoint,
  CityWeather,
} from "@/components/dashboard/weather-service";

interface PdfExportButtonProps {
  weatherData: CityWeather[];
  className?: string;
}

export const PdfExportButton = ({
  weatherData,
  className,
}: PdfExportButtonProps) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Weather Forecast Report", 14, 20);

    weatherData.forEach((cityData, index) => {
      if (index > 0) {
        doc.addPage();
      }

      doc.setFontSize(14);
      doc.text(`City: ${cityData.city}`, 14, 30);

      const tableData = cityData.data.map((point) => {
        const [dateStr, timeStr] = point.dt_txt.split(" ");
        return [
          dateStr,
          timeStr.substring(0, 5),
          `${point.temp}°C`,
          `${point.humidity}%`,
          `${point.windSpeed} m/s`,
          `${point.windDirection}°`,
          `${point.visibility} m`,
          `${point.pressure} hPa`,
          point.weatherMain,
        ];
      });

      autoTable(doc, {
        startY: 40,
        head: [
          [
            "Date",
            "Time",
            "Temp",
            "Humidity",
            "Wind Speed",
            "Wind Dir",
            "Visibility",
            "Pressure",
            "Description",
          ],
        ],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 35 },
          9: { cellWidth: 20 },
        },
      });
    });

    doc.save("weather_forecast.pdf");
  };

  return (
    <Button onClick={exportToPDF} variant="outline" className={className}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
};
