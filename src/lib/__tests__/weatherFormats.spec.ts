import { WeatherForecast } from "../types/weatherService";
import {
  celciusToFahrenheit,
  temperaturesToFahrenheight,
} from "../weatherFormats";

describe("weather formats", () => {
  test.each([
    {
      celcius: 0,
      fahrenheit: 32,
    },
    {
      celcius: 22,
      fahrenheit: 71,
    },
    {
      celcius: 100,
      fahrenheit: 212,
    },
  ])("$celciusºC is $fahrenheitºF", ({ celcius, fahrenheit }) => {
    const result = celciusToFahrenheit(celcius);
    expect(result).toBe(fahrenheit);
  });

  test("temperaturesToFahrenheight returns 0º and empty array if undefined is passed", () => {
    const result = temperaturesToFahrenheight(undefined);
    expect(result).toMatchObject({
      high: 0,
      low: 0,
      hourly: [],
    });
  });

  test("temperaturesToFahrenheight converts the temperatures to ºF", () => {
    const forecast: WeatherForecast["temp"] = {
      high: 100,
      low: 0,
      hourly: [
        {
          time: "any",
          degrees: 22,
        },
      ],
    };

    const result = temperaturesToFahrenheight(forecast);
    expect(result).toMatchObject({
      high: 212,
      hourly: [
        {
          degrees: 71,
          time: "any",
        },
      ],
      low: 32,
    });
  });
});
