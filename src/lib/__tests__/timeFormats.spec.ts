import { formatHours } from "../timeFormats";

describe("time formats", () => {
  test("Formats an ISO string into the correct local time", () => {
    const result = formatHours("2023-02-15T15:30:11.668Z");
    expect(result).toMatch("4:30 AM");
  });
});
