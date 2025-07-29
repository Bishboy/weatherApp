import type { ForecastData } from "@/api/Types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForcastProps {
  data: ForecastData;
}

interface DailyForcast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForcast = ({ data }: WeatherForcastProps) => {
  const dailyForcast = data.list.reduce((acc, item) => {
    const date = format(new Date(item.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        wind: item.wind.speed,
        weather: item.weather[0],
        date: item.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForcast>);

  const nextDay = Object.values(dailyForcast).slice(0, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;  
  console.log(nextDay);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>5-day Forcast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {nextDay.map((item) => (
              <div
                key={item.date}
                className="grid grid-cols-3 items-center md:gap-4 rounded-lg border p-4"
              >
                <div className="">
                  <p className="font-medium">
                    {format(new Date(item.date * 1000), "yyyy-MM-dd")}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.weather.description}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row jsustify-center gap-1 md:gap-4">
                  <span className="flex items-center text-blue-500">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    {formatTemp(item.temp_min)}
                  </span>
                  <span className="flex items-center text-red-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemp(item.temp_max)}
                  </span>
                </div>

                <div className="flex justify-end md:gap-4 lg:flex-row flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{item.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{item.wind}m/s</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherForcast;
