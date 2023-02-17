import React from "react";
import { render, screen, userEvent } from "./test-utils";
import { LocationSearch } from "../LocationSearch";
import { server, rest } from "@weather/mocks/server";

describe("LocationSearch", () => {
  test("renders the search options, excluding options the user has already selected", async () => {
    server.use(
      rest.get("*/api/search", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            locations: ["Sydney, Australia", "Wellington, New Zealand"],
          })
        );
      })
    );

    const omittedLocations = ["Wellington, New Zealand"];

    const user = userEvent.setup();
    render(<LocationSearch omittedLocations={omittedLocations} />);

    const input = screen.getByRole("combobox");
    // type something to trigger the search query
    user.type(input, "a");

    const locations = (await screen.findAllByRole("option")).map(
      (item) => item.textContent
    );

    expect(locations).toEqual(["Sydney, Australia"]);
  });
});
