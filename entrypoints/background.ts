import { browser } from "wxt/browser";

import type { ExtensionMessage } from "../lib/messages";
import {
  RESEARCH_STORAGE_KEY,
  addCandidateToProject,
  countCandidates,
  createInitialResearchState,
  ensureResearchState,
  getActiveProject,
  type CandidateDraft,
  type ResearchState,
} from "../lib/research";

const CONTEXT_MENU_ID = "add-selection-candidate";

async function readResearchState(): Promise<ResearchState> {
  const result = await browser.storage.local.get(RESEARCH_STORAGE_KEY);
  return ensureResearchState(result[RESEARCH_STORAGE_KEY]);
}

async function writeResearchState(state: ResearchState): Promise<void> {
  await browser.storage.local.set({ [RESEARCH_STORAGE_KEY]: state });
}

async function updateBadge(state?: ResearchState): Promise<void> {
  const currentState = state ?? (await readResearchState());
  const total = countCandidates(currentState);

  await browser.action.setBadgeBackgroundColor({ color: "#0f3d33" });
  await browser.action.setBadgeText({ text: total > 0 ? String(total) : "" });
}

async function initializeState(): Promise<ResearchState> {
  const result = await browser.storage.local.get(RESEARCH_STORAGE_KEY);
  const incoming = result[RESEARCH_STORAGE_KEY];

  if (incoming === undefined) {
    const state = createInitialResearchState();
    await writeResearchState(state);
    return state;
  }

  const state = ensureResearchState(incoming);
  await writeResearchState(state);
  return state;
}

async function saveCandidateToActiveProject(
  draft: CandidateDraft,
): Promise<void> {
  const state = await readResearchState();
  const activeProject = getActiveProject(state);
  const nextState = addCandidateToProject(state, activeProject.id, draft);

  await writeResearchState(nextState);
  await updateBadge(nextState);
}

async function createContextMenu(): Promise<void> {
  await browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Add to Candidate List",
    contexts: ["selection"],
  });
}

async function handleSelectionMenuClick(
  selectionText: string,
  pageUrl: string,
): Promise<void> {
  const draft: CandidateDraft = {
    title: selectionText,
    url: pageUrl,
  };

  await saveCandidateToActiveProject(draft);
}

function isSaveDetectedProductMessage(
  message: ExtensionMessage,
): message is Extract<ExtensionMessage, { type: "save-detected-product" }> {
  return message.type === "save-detected-product";
}

export default defineBackground({
  type: "module",
  main() {
    browser.runtime.onInstalled.addListener(() => {
      void (async () => {
        const state = await initializeState();
        await createContextMenu();
        await updateBadge(state);
      })();
    });

    browser.runtime.onStartup.addListener(() => {
      void (async () => {
        await createContextMenu();
        await updateBadge();
      })();
    });

    browser.contextMenus.onClicked.addListener((info, tab) => {
      if (
        info.menuItemId !== CONTEXT_MENU_ID ||
        !info.selectionText ||
        !tab?.url ||
        !tab.url.startsWith("http")
      ) {
        return;
      }

      void handleSelectionMenuClick(info.selectionText, tab.url);
    });

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[RESEARCH_STORAGE_KEY]) {
        return;
      }

      void updateBadge();
    });

    browser.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (!isSaveDetectedProductMessage(message)) {
        return undefined;
      }

      const data = message.data;
      if (!data.url.trim() || !data.title.trim()) {
        return Promise.resolve({ ok: false });
      }

      const draft: CandidateDraft = {
        title: data.title,
        price: data.price,
        url: data.url,
        image: data.image,
      };

      return saveCandidateToActiveProject(draft).then(() => ({ ok: true }));
    });
  },
});
