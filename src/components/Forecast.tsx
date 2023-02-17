import { WiDaySunny, WiRain, WiCloudy } from "react-icons/wi";
import {
  WeatherForecast,
  WeatherType,
} from "@weather/lib/types/weatherService";
import { Temperature, TemperatureUnit } from "./Temperature";
import { IconType } from "react-icons";
import { temperaturesToFahrenheight } from "@weather/lib/weatherFormats";

interface ForecastProps {
  unit: TemperatureUnit;
  weather: WeatherForecast["weather"];
  temp: WeatherForecast["temp"];
}

const WeatherIcons: Record<WeatherType, IconType> = {
  sunny: WiDaySunny,
  rain: WiRain,
  cloudy: WiCloudy,
};

export const Forecast: React.FC<ForecastProps> = ({ weather, temp, unit }) => {
  const WeatherIcon = WeatherIcons[weather];

  return (
    <div className="flex justify-between items-center mb-4">
      <p className="flex items-center">
        High:{" "}
        <Temperature
          style="block"
          temperature={temp.high}
          unit={unit}
          prominence="high"
        />
      </p>
      <p className="flex items-center">
        Low: <Temperature style="block" temperature={temp.low} unit={unit} />
      </p>
      <p>
        <span className="text-sm">{weather}</span>
      </p>
      <div className="">
        <WeatherIcon color={"#64758b"} size={80} />
      </div>
    </div>
  );
};
