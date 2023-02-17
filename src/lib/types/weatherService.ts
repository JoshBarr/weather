export interface GeocodeAddressParams {
  location: string;
}

export type Coordinates = {
  lat: number;
  long: number;
};

export interface GeocodeAddressResult {
  data: Coordinates;
}

export interface GetForecastByCoordinates {
  lat: number;
  long: number;
}

export interface TemperatureForecast {
  degrees: number;
  time: string;
}

export type WeatherType = "cloudy" | "rain" | "sunny";
export type Precipitation = "rain" | "not-rain";

export interface WeatherForecast {
  temp: {
    hourly: TemperatureForecast[];
    high: number;
    low: number;
  };
  weather: WeatherType;
  // Extension: add a current value for precipitation.
  // There would also usually be a current temp and
  // current wind speed/direction here, but these are
  // out of scope for this demo
  precipitation?: Precipitation;
}

export type GetForecastByCoordinatesResult = { data: WeatherForecast };

export type ErrorResponse = { error: string };

export type ResultType<T> = T | ErrorResponse;
