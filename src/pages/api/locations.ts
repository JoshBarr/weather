// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  LocationsResponse,
  WeatherLocation,
} from "@weather/lib/types/locations";
import { getMockStore } from "@weather/mocks/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { ulid } from "ulidx";

// out of scope: obtaining the userId/sign in.
const mockStore = getMockStore();

// Locations that appear when the user first visits the app
const defaultLocations: WeatherLocation[] = [
  {
    id: ulid(),
    address: "Wellington, New Zealand",
    isSubscribedToAlerts: false,
  },
];

/**
 * Note: this is just a dirty stub server to show how
 * we might persist the data into a store. It's intentionally RPC-ish,
 * as we're using an object as the DB.
 *
 * This DB will NOT survive sever restarts.
 *
 * The store is just keyed off the session, in the real world
 * there would be a map between user <> sessions so that the user
 * could see the same items on all devices.
 *
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationsResponse | { error: string }>
) {
  // Simulate a real-world network...
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500));

  // set by middleware, will always be present
  const sessionId = req.cookies["sessionId"] as string;
  console.log(`${req.method} ${req.url} sid:${sessionId} `);
  res.setHeader("cache-control", "private");

  if (req.method === "GET") {
    const session = mockStore.getSession(sessionId);

    if (!session) {
      mockStore.createSession(sessionId, {
        locations: defaultLocations,
      });
    }

    res.status(200).json(session);
    return;
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body) as LocationsResponse["locations"][0];
    const existing = mockStore.getLocation(sessionId, body.address);

    if (existing) {
      return res.status(409).json({ error: "conflict" });
    } else {
      mockStore.addLocation(sessionId, body);
      res.status(200).json(mockStore.getSession(sessionId));
    }
    return;
  }

  if (req.method === "PUT") {
    const body = JSON.parse(req.body) as WeatherLocation;

    const existing = mockStore.getLocation(sessionId, body.address);

    if (existing) {
      mockStore.updateLocation(sessionId, body.address, body);
    } else {
      return res.status(404).json({ error: "not found" });
    }

    res.status(200).json(mockStore.getSession(sessionId));
    return;
  }

  if (req.method === "DELETE") {
    const locationName = req.query.location as string;

    const existing = mockStore.getLocation(sessionId, locationName);

    if (!existing) {
      res.status(404).json({ error: "not found" });
      return;
    }

    mockStore.deleteLocation(sessionId, locationName);

    res.status(200).json(mockStore.getSession(sessionId));
    return;
  }

  return res.status(404).json({ error: "not found" });
}
