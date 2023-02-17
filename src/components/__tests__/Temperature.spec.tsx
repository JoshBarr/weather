import React from "react";
import { render, screen } from "./test-utils";
import { Temperature } from "../Temperature";

describe("Temperature", () => {
  test("renders the temp in ºC", () => {
    render(<Temperature unit="celcius" temperature={10} />);

    expect(screen.getByText("10")).toBeDefined();
    expect(screen.getByText("ºC")).toBeDefined();
  });

  test("renders the temp in ºF", () => {
    render(<Temperature unit="fahrenheit" temperature={75} />);

    expect(screen.getByText("75")).toBeDefined();
    expect(screen.getByText("ºF")).toBeDefined();
  });
});
