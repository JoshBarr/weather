// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mockGlobalWeather, randomPrecipitation } from "@weather/mocks/weather";
import {
  GetForecastByCoordinatesResult,
  ResultType,
  WeatherForecast,
} from "@weather/lib/types/weatherService";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Typeahead search for locations
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultType<GetForecastByCoordinatesResult>>
) {
  const { coords } = req.query;

  if (!Array.isArray(coords)) {
    return res.status(400).json({ error: "invalid request" });
  }

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1500));

  const [lat, long] = coords;
  const key = `${lat}:${long}`;
  const data = mockGlobalWeather[key];

  if (!data) {
    return res.status(404).json({
      error: "not found",
    });
  }

  res.status(200).json({
    data: {
      ...data,
      // Make the current rain status random on each fetch
      // so that we can observe it in the UI. There's a 33%
      // chance that it's currently raining
      precipitation: randomPrecipitation(0.33),
    },
  });
}
