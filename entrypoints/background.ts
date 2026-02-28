import { browser } from 'wxt/browser';

const COUNTER_KEY = 'popupOpenCount';

async function getCounter(): Promise<number> {
  const result = await browser.storage.local.get(COUNTER_KEY);
  return typeof result[COUNTER_KEY] === 'number' ? result[COUNTER_KEY] : 0;
}

async function updateBadge(count?: number): Promise<void> {
  const nextCount = count ?? (await getCounter());
  const badgeText = nextCount > 0 ? String(nextCount) : '';

  await browser.action.setBadgeBackgroundColor({ color: '#10233f' });
  await browser.action.setBadgeText({ text: badgeText });
}

export default defineBackground({
  type: 'module',
  main() {
    browser.runtime.onInstalled.addListener(() => {
      void (async () => {
        const count = await getCounter();
        await browser.storage.local.set({ [COUNTER_KEY]: count });
        await updateBadge(count);
      })();
    });

    browser.runtime.onStartup.addListener(() => {
      void updateBadge();
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local' || !changes[COUNTER_KEY]) {
        return;
      }

      const newValue = changes[COUNTER_KEY].newValue;
      if (typeof newValue === 'number') {
        void updateBadge(newValue);
      }
    });
  }
});
