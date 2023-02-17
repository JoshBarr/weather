// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { mockedLocations } from "@weather/mocks/weather";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  locations: string[];
};

/**
 * Typeahead search for locations
 * @param req
 * @param res
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const query = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q || "";

  const suggestions = mockedLocations.filter((location) => {
    return location.toLowerCase().includes(query.toLowerCase());
  });

  res.status(200).json({
    locations: suggestions,
  });
}
