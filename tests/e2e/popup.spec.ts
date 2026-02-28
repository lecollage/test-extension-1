import { expect, test } from "./fixtures";

test("renders the popup and updates the counter across loads", async ({
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  const openDetailsButton = page.getByRole("button", {
    name: "Open time details",
  });
  const summaryCount = page.locator("#open-count-summary");
  const modal = page.getByRole("dialog");
  const modalCount = page.locator("#open-count-modal");
  const openedAt = page.locator("#opened-at");
  const currentTime = page.locator("#current-time");

  await expect(
    page.getByRole("heading", { name: "Time Popup Counter" }),
  ).toBeVisible();
  await expect(summaryCount).toHaveText("1");
  await expect(openDetailsButton).toBeVisible();

  await openDetailsButton.click();

  await expect(modal).toBeVisible();
  await expect(modalCount).toHaveText("1");
  await expect(openedAt).not.toHaveText("--:--:--");

  const initialTime = await currentTime.innerText();
  await page.waitForTimeout(1100);
  await expect(currentTime).not.toHaveText(initialTime);

  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();

  await page.reload();
  await expect(summaryCount).toHaveText("2");
});
