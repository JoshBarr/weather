import {
  addLocation,
  getForecast,
  getLocation,
  getLocations,
  getSuggestions,
  removeLocation,
  updateLocation,
} from "../api";
import { server, waitForRequest } from "../../mocks/server";
import { rest } from "msw";
import { WeatherLocation } from "@weather/lib/types/locations";

describe("queries", () => {
  test("getForecast fetches the forecast", async () => {
    const result = await getForecast("a location");
    expect(result.weather).toBe("cloudy");
    expect(result.temp).toMatchObject({
      high: 10,
      low: 5,
    });
  });

  test("throws if the status is not 200, so that react-query can retry the request", async () => {
    server.use(
      rest.get("*", (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({}));
      })
    );

    await expect(async () => {
      await getForecast("a location");
    }).rejects.toThrow();
  });

  test("getSuggestions searches via query parameter", async () => {
    const path = "*/api/search*";
    const capturedRequest = waitForRequest("GET", path);

    server.use(
      rest.get(path, (req, res, ctx) => {
        return res(
          ctx.json({
            locations: ["Singapore, Singapore"],
          })
        );
      })
    );

    const result = await getSuggestions("sing");
    const request = await capturedRequest;

    expect(request.url.search).toBe("?q=sing");
    expect(result).toContain("Singapore, Singapore");
  });

  test("getLocations loads the user's locations from the server", async () => {
    server.use(
      rest.get("*/api/locations", (req, res, ctx) => {
        return res(
          ctx.json({
            locations: [
              {
                location: "Wellington, New Zealand",
              },
              {
                location: "Singapore, Singapore",
              },
            ],
          })
        );
      })
    );

    const result = await getLocations();

    expect(result.at(0)).toMatchObject({
      location: "Wellington, New Zealand",
    });
  });

  test("getLocation loads a specific location from the server", async () => {
    server.use(
      rest.get("*/api/locations", (req, res, ctx) => {
        return res(
          ctx.json({
            locations: [
              {
                address: "Wellington, New Zealand",
              },
            ] as WeatherLocation[],
          })
        );
      })
    );

    const result = await getLocation("Wellington, New Zealand");

    expect(result).toMatchObject({
      address: "Wellington, New Zealand",
    });
  });

  test("addLocation posts a new location to the server", async () => {
    const path = "*/api/locations";
    const capturedRequest = waitForRequest("POST", path);

    server.use(
      rest.post(path, (req, res, ctx) => {
        return res(
          ctx.json({
            locations: [
              {
                address: "Wellington, New Zealand",
              },
            ],
          })
        );
      })
    );

    await addLocation({
      address: "Sydney, Australia",
      id: "any",
      isSubscribedToAlerts: false,
    });

    const request = await capturedRequest;
    expect(await request.json()).toMatchObject({
      address: "Sydney, Australia",
      id: "any",
      isSubscribedToAlerts: false,
    });
  });

  test("updateLocation posts the location to the server", async () => {
    const path = "*/api/locations";
    const capturedRequest = waitForRequest("PUT", path);

    server.use(
      rest.put(path, (req, res, ctx) => {
        return res(
          ctx.json({
            locations: [
              {
                address: "Sydney, Australia",
              },
            ] as WeatherLocation[],
          })
        );
      })
    );

    await updateLocation({
      address: "Sydney, Australia",
      id: "any",
      isSubscribedToAlerts: false,
    });

    const request = await capturedRequest;
    expect(await request.json()).toMatchObject({
      address: "Sydney, Australia",
    });
  });

  test("deleteLocation removes a location", async () => {
    const path = "*/api/locations";
    const capturedRequest = waitForRequest("DELETE", path);

    server.use(
      rest.delete(path, (req, res, ctx) => {
        return res(
          ctx.json({
            locations: [
              {
                address: "Sydney, Australia",
              },
            ] as WeatherLocation[],
          })
        );
      })
    );

    await removeLocation("Sydney, Australia");

    const request = await capturedRequest;
    expect(request.url.searchParams.get("location")).toBe("Sydney, Australia");
  });
});
