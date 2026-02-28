import { browser } from 'wxt/browser';

import { getChangedCounterValue, getStoredCounterValue } from '../lib/background';
import { badgeTextForCount } from '../lib/extension-state';

const COUNTER_KEY = 'popupOpenCount';

async function getCounter(): Promise<number> {
  const result = await browser.storage.local.get(COUNTER_KEY);
  return getStoredCounterValue(result[COUNTER_KEY]);
}

async function updateBadge(count?: number): Promise<void> {
  const nextCount = count ?? (await getCounter());
  const badgeText = badgeTextForCount(nextCount);

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
      const newValue = getChangedCounterValue(changes, areaName, COUNTER_KEY);
      if (newValue !== null) {
        void updateBadge(newValue);
      }
    });
  }
});
