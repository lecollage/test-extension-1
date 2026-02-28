import { chromium, expect, test as base, type BrowserContext } from '@playwright/test';
import path from 'node:path';

type ExtensionFixtures = {
  context: BrowserContext;
  extensionId: string;
};

export const test = base.extend<ExtensionFixtures>({
  context: async (_args, use, testInfo) => {
    const extensionPath = path.resolve(process.cwd(), '.output/chrome-mv3');
    const context = await chromium.launchPersistentContext(testInfo.outputPath('user-data-dir'), {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  }
});

export { expect };
