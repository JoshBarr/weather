import { mockHourlyData } from "@weather/mocks/weather";
import { HourlyForecast } from "../HourlyForecast";
import { render, screen } from "./test-utils";

describe("HourlyForecast", () => {
  test("", () => {
    render(
      <HourlyForecast
        temp={{
          hourly: mockHourlyData(5, 10),
        }}
        unit={"fahrenheit"}
      />
    );

    expect(screen.getByText("12:00 AM")).toBeTruthy();
    expect(screen.getByText("12:00 PM")).toBeTruthy();
  });
});
