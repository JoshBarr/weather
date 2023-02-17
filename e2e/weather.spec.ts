import { test, expect } from "@playwright/test";

const startUrl = "http://localhost:3000";

test("can add and remove a weather card, that persists between page loads", async ({
  page,
}) => {
  await page.goto(startUrl);
  await expect(page).toHaveTitle(/Weather/);

  await page.getByRole("combobox").type("sydney");
  await page.getByRole("option", { name: /sydney/i }).click();

  const locator = page.locator("h3");
  await expect(locator).toContainText(["Sydney, Australia"]);

  // Remembers the cards post-refresh
  await page.reload();

  await expect(page.locator("h3")).toContainText(["Sydney, Australia"]);

  const sydneyCard = page.getByTestId("weather-card").filter({
    hasText: /sydney/i,
  });

  await sydneyCard.getByRole("button", { name: /remove/i }).click();

  const locatorAfterRemove = page.locator("h3");
  await expect(locatorAfterRemove).not.toContainText(["Sydney, Australia"]);
});

test("can toggle between ºC and ºF", async ({ page }) => {
  await page.goto(startUrl);

  await page.waitForSelector("[data-testid=weather-card]");

  await page
    .getByRole("button", { name: "Show temperatures in fahrenheit" })
    .click();

  let tempSymbol = await page.getByTestId("temperature").nth(0).innerText();
  expect(tempSymbol).toMatch(/ºF/);

  await page
    .getByRole("button", { name: "Show temperatures in celcius" })
    .click();

  tempSymbol = await page.getByTestId("temperature").nth(0).innerText();
  expect(tempSymbol).toMatch(/ºC/);
});

test("shows a message if there are no search results", async ({ page }) => {
  await page.goto(startUrl);
  await page.getByRole("combobox").type("mars");
  await expect(page.getByText("no results")).toContainText("no results");
});

test("when rain alerts are enabled, shows an alert when it starts raining", async ({
  page,
}) => {
  await page.goto(startUrl);

  // wellington is displayed by default, of course
  await page.waitForSelector("[data-testid=weather-card]");

  await page.getByRole("button", { name: /enable rain alerts/i }).click();

  page.getByRole("button", { name: /disable rain alerts/i });

  // rain only occurs some of the time.
  // retry this block until it passes: https://playwright.dev/docs/test-assertions#retrying
  await expect(async () => {
    await page
      .getByRole("button", {
        name: /simulate push refresh from weather server/i,
      })
      .click();

    await expect(
      page.getByText(/raining in Wellington, New Zealand/)
    ).toBeVisible({
      timeout: 2000,
    });
  }).toPass({
    intervals: [1000, 1000, 1000, 1000, 1000, 1000],
    timeout: 20000,
  });
});
