import {
  Coordinates,
  Precipitation,
  WeatherForecast,
  WeatherType,
} from "../lib/types/weatherService";

export const mockHourlyData = (high: number, low: number) => {
  return Array.from(Array(24).keys()).map((hour) => {
    const time = new Date(new Date().setUTCHours(0, 0, 0, 0));
    time.setHours(hour, 0, 0, 0);

    const degrees = between(low, high);

    return {
      time: time.toISOString(),
      degrees,
    };
  });
};

export function randomWeather(): WeatherType {
  const num = Math.random();

  if (num < 0.33) {
    return "cloudy";
  }

  if (num < 0.66) {
    return "sunny";
  }

  return "rain";
}

export function randomPrecipitation(chanceOfRain: number): Precipitation {
  const num = Math.random();

  if (num < chanceOfRain) {
    return "rain";
  }

  return "not-rain";
}

export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const mockCoordinates: Record<string, Coordinates> = {
  "Wellington, New Zealand": {
    lat: -41.28666552,
    long: 174.772996908,
  },
  "Sydney, Australia": {
    lat: -33.865143,
    long: 151.2099,
  },
  "Madurai, Tamil Nadu, India": {
    lat: 9.939093,
    long: 78.121719,
  },
  "New York City, New York, USA": {
    lat: 40.73061,
    long: -73.935242,
  },
  "Singapore, Singapore": {
    lat: 1.29027,
    long: 103.851959,
  },
};

export const mockedLocations = Object.keys(mockCoordinates);

export const mockGlobalWeather: Record<string, WeatherForecast> = {};

Object.values(mockCoordinates).forEach((coordinates) => {
  const highTemp = between(16, 30);
  const lowTemp = between(0, 10);
  const forecast: WeatherForecast = {
    weather: randomWeather(),
    temp: {
      high: highTemp,
      low: lowTemp,
      hourly: mockHourlyData(lowTemp, highTemp),
    },
  };
  mockGlobalWeather[`${coordinates.lat}:${coordinates.long}`] = forecast;
});
