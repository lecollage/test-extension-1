import { expect, test } from "./fixtures";

test("renders shopping research popup and grouped candidates", async ({
  extensionId,
  page,
}) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  await expect(
    page.getByRole("heading", { name: "Shopping Research Helper" }),
  ).toBeVisible();
  await expect(page.getByText("No candidates yet.")).toBeVisible();

  await page.evaluate(async () => {
    await chrome.storage.local.set({
      shoppingResearchState: {
        activeProjectId: "project_a",
        projects: [
          {
            id: "project_a",
            name: "Monitor Stand Research",
            createdAt: "2026-03-09T12:00:00.000Z",
            updatedAt: "2026-03-09T12:00:00.000Z",
            groups: [
              {
                id: "group_a",
                key: "ergotron-lx",
                label: "Ergotron LX",
                isCollapsed: false,
                candidates: [
                  {
                    id: "candidate_a",
                    title: "Ergotron LX Monitor Arm",
                    price: "$59",
                    url: "https://example.com/p/ergotron-lx",
                    image: "",
                    notes: "",
                    createdAt: "2026-03-09T12:00:00.000Z",
                    updatedAt: "2026-03-09T12:00:00.000Z",
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  await page.reload();

  await expect(page.getByText("Ergotron LX (1)")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ergotron LX Monitor Arm" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Collapse" }).click();
  await expect(
    page.getByRole("link", { name: "Ergotron LX Monitor Arm" }),
  ).toBeHidden();
});
