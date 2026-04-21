// @ts-check
import { test, expect } from "@playwright/test";

async function keyboardTest(page, id) {
  await page.goto("/");
  const searchElement = page.locator(id);
  await searchElement.pressSequentially("Årh", { delay: 100 });
  await page.getByRole("option", { name: "Århusgade" }).waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.getByRole("option", { name: "Århusgade 2100" }).waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.getByRole("option", { name: "Århusgade 1, 2100" }).waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page
    .getByRole("option", { name: "Århusgade 1, st. tv, 2100" })
    .waitFor();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(searchElement).toHaveValue(
    "Århusgade 1, st. tv, 2100 København Ø",
  );
}

async function pointerTest(page, id) {
  await page.goto("/");
  const searchElement = page.locator(id);
  await searchElement.pressSequentially("Årh", { delay: 100 });
  await page.getByRole("option", { name: "Århusgade" }).click();
  await page.getByRole("option", { name: "Århusgade 2100" }).click();
  await page.getByRole("option", { name: "Århusgade 1, 2100" }).click();
  await page.getByRole("option", { name: "Århusgade 1, st. tv, 2100" }).click();
  await expect(searchElement).toHaveValue(
    "Århusgade 1, st. tv, 2100 København Ø",
  );
}

async function visibilityTest(page, id) {
  await page.goto("/");
  await expect(page.locator(id)).toBeVisible();
}

test("CDN search field visible", async ({ page }) => {
  await visibilityTest(page, "input#demoCDN");
});

test("ESM search field visible", async ({ page }) => {
  await visibilityTest(page, "input#demoES");
});

test("Web component search field visible", async ({ page }) => {
  await visibilityTest(page, "adressevaegler-input input");
});

test("Use web component with keyboard", async ({ page }) => {
  await keyboardTest(page, "adressevaegler-input input");
});

test("Use CDN component with keyboard", async ({ page }) => {
  await keyboardTest(page, "input#demoCDN");
});

test("Use web component with mouse/touch", async ({ page }) => {
  await pointerTest(page, "adressevaegler-input input");
});

test("Use CDN component with mouse/touch", async ({ page }) => {
  await pointerTest(page, "input#demoCDN");
});
