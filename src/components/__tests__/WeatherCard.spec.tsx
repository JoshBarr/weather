import React from "react";
import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from "./test-utils";
import { WeatherCard } from "../WeatherCard";
import { server, rest } from "@weather/mocks/server";
import { mockCoordinates, mockGlobalWeather } from "@weather/mocks/weather";
import { WeatherLocation } from "@weather/lib/types/locations";

describe("WeatherCard", () => {
  test("renders a WeatherCard, and can toggle the hourly display open and closed. The state is persisted to the server.", async () => {
    const address = "Sydney, Australia";
    const coords = mockCoordinates[address];
    const forecast = mockGlobalWeather[`${coords.lat}:${coords.long}`];

    const mockServerState = {
      locations: [
        {
          address,
        },
      ] as WeatherLocation[],
    };

    server.use(
      rest.all("*/api/locations", async (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockServerState));
      }),
      rest.get("*/api/coordinates/*", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            data: coords,
          })
        );
      }),
      rest.get("*/api/forecast/*", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            data: forecast,
          })
        );
      })
    );

    const user = userEvent.setup();
    render(<WeatherCard address={address} unit={"celcius"} />);
    expect(screen.getByText(address)).toBeDefined();

    await waitForElementToBeRemoved(() =>
      screen.queryByText(/Loading forecast.../)
    );

    expect(screen.getByText(forecast.temp.high)).toBeDefined();
    expect(screen.getByText(forecast.temp.low)).toBeDefined();
    expect(screen.getByText(forecast.weather)).toBeDefined();

    const btn = screen.getByRole("button", { name: "Expand" });
    await user.click(btn);

    await screen.findByText("10:00 AM", undefined, { timeout: 1000 });
    const btnClose = screen.getByRole("button", { name: "Collapse" });
    await user.click(btnClose);

    await screen.findByText("Expand", undefined, { timeout: 1000 });
  });
});
