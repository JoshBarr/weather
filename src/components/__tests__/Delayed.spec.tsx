import React from "react";
import { act, render, screen } from "./test-utils";
import { Delayed } from "../Delayed";

describe("Delayed", () => {
  test("delays rendering until the specified timeout", async () => {
    jest.useFakeTimers();

    render(
      <Delayed waitFor={500}>
        <>child component</>
      </Delayed>
    );

    expect(screen.queryByText("child component")).toBeNull();
    act(() => jest.advanceTimersByTime(600));
    expect(screen.queryByText("child component")).toBeDefined();
  });
});
