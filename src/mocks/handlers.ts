import { rest } from "msw";
import {
  GeocodeAddressResult,
  GetForecastByCoordinatesResult,
} from "../lib/types/weatherService";
import { mockHourlyData } from "./weather";

export const handlers = [
  rest.get(`*/api/coordinates/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<GeocodeAddressResult>({
        data: {
          lat: -41.1111,
          long: 42.0,
        },
      })
    );
  }),
  rest.get(`*/api/forecast/*/*`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<GetForecastByCoordinatesResult>({
        data: {
          temp: {
            high: 10,
            low: 5,
            hourly: mockHourlyData(10, 5),
          },
          weather: "cloudy",
        },
      })
    );
  }),
];
