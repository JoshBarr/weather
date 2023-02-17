// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mockCoordinates, mockedLocations } from "@weather/mocks/weather";
import {
  GeocodeAddressResult,
  ResultType,
} from "@weather/lib/types/weatherService";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Typeahead search for locations
 * @param req
 * @param res
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResultType<GeocodeAddressResult>>
) {
  const { location: locationQueryParam } = req.query;
  const location = Array.isArray(locationQueryParam)
    ? locationQueryParam[0]
    : locationQueryParam;

  if (!location) {
    return res.status(400).json({
      error: "missing location query",
    });
  }

  const data = mockCoordinates[location];

  if (!data) {
    return res.status(404).json({
      error: "not found",
    });
  }

  res.status(200).json({
    data,
  });
}
