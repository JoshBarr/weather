import { WeatherForecast } from "./types/weatherService";

// TODO: Assume whole numbers are acceptable - check with users?
export function celciusToFahrenheit(degreesCelcius: number) {
  return Math.floor((degreesCelcius * 9) / 5 + 32);
}

export function temperaturesToFahrenheight(
  temperatures?: WeatherForecast["temp"]
): WeatherForecast["temp"] {
  if (!temperatures) {
    return {
      high: 0,
      low: 0,
      hourly: [],
    };
  }

  return {
    high: celciusToFahrenheit(temperatures.high),
    low: celciusToFahrenheit(temperatures.low),
    hourly: temperatures.hourly.map((hour) => ({
      ...hour,
      degrees: celciusToFahrenheit(hour.degrees),
    })),
  };
}
