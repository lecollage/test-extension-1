import "./style.css";
import { browser } from "wxt/browser";

import type { ExtensionMessage, ProductPageData } from "../../lib/messages";
import {
  RESEARCH_STORAGE_KEY,
  addCandidateToProject,
  addProject,
  createInitialResearchState,
  deleteCandidate,
  deleteProject,
  ensureResearchState,
  getActiveProject,
  renameProject,
  selectActiveProject,
  toggleGroupCollapse,
  updateCandidate,
  type CandidateDraft,
  type ResearchState,
} from "../../lib/research";

const projectSelectElement =
  document.querySelector<HTMLSelectElement>("#project-select");
const createProjectButton =
  document.querySelector<HTMLButtonElement>("#create-project");
const renameProjectButton =
  document.querySelector<HTMLButtonElement>("#rename-project");
const deleteProjectButton =
  document.querySelector<HTMLButtonElement>("#delete-project");
const saveCurrentPageButton =
  document.querySelector<HTMLButtonElement>("#save-current-page");
const statusMessageElement =
  document.querySelector<HTMLParagraphElement>("#status-message");
const groupsListElement =
  document.querySelector<HTMLDivElement>("#groups-list");

function ensureElement<T extends Element>(element: T | null, id: string): T {
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }

  return element;
}

const projectSelectNode = ensureElement(projectSelectElement, "project-select");
const createProjectNode = ensureElement(createProjectButton, "create-project");
const renameProjectNode = ensureElement(renameProjectButton, "rename-project");
const deleteProjectNode = ensureElement(deleteProjectButton, "delete-project");
const saveCurrentPageNode = ensureElement(
  saveCurrentPageButton,
  "save-current-page",
);
const statusMessageNode = ensureElement(statusMessageElement, "status-message");
const groupsListNode = ensureElement(groupsListElement, "groups-list");

let currentState: ResearchState = createInitialResearchState();

async function readState(): Promise<ResearchState> {
  const result = await browser.storage.local.get(RESEARCH_STORAGE_KEY);
  return ensureResearchState(result[RESEARCH_STORAGE_KEY]);
}

async function persistState(nextState: ResearchState): Promise<void> {
  currentState = nextState;
  await browser.storage.local.set({ [RESEARCH_STORAGE_KEY]: nextState });
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(message: string): void {
  statusMessageNode.textContent = message;
}

function renderProjects(state: ResearchState): void {
  projectSelectNode.innerHTML = state.projects
    .map(
      (project) =>
        `<option value="${escapeHtml(project.id)}" ${project.id === state.activeProjectId ? "selected" : ""}>${escapeHtml(project.name)}</option>`,
    )
    .join("");
}

function renderGroups(state: ResearchState): void {
  const activeProject = getActiveProject(state);
  if (activeProject.groups.length === 0) {
    groupsListNode.innerHTML = '<p class="empty">No candidates yet.</p>';
    return;
  }

  groupsListNode.innerHTML = activeProject.groups
    .map((group) => {
      const candidatesHtml = group.isCollapsed
        ? ""
        : group.candidates
            .map(
              (candidate) => `
            <article class="candidate" data-candidate-id="${escapeHtml(candidate.id)}" data-group-id="${escapeHtml(group.id)}">
              <h3 class="candidate__title">
                <a href="${escapeHtml(candidate.url)}" target="_blank" rel="noreferrer">${escapeHtml(candidate.title)}</a>
              </h3>
              <p class="candidate__meta">${escapeHtml(candidate.price || "Price not detected")}</p>
              <textarea class="candidate__notes" data-notes-for="${escapeHtml(candidate.id)}" placeholder="Add notes">${escapeHtml(candidate.notes)}</textarea>
              <div class="candidate__actions">
                <button class="button button--ghost" type="button" data-action="rename-candidate">Rename</button>
                <button class="button button--ghost" type="button" data-action="save-notes">Save notes</button>
                <button class="button button--danger" type="button" data-action="delete-candidate">Delete</button>
              </div>
            </article>
          `,
            )
            .join("");

      return `
        <section class="group" data-group-id="${escapeHtml(group.id)}">
          <header class="group__header">
            <h3 class="group__title">${escapeHtml(group.label)} (${group.candidates.length})</h3>
            <button class="button button--ghost" type="button" data-action="toggle-group" data-group-id="${escapeHtml(group.id)}">
              ${group.isCollapsed ? "Expand" : "Collapse"}
            </button>
          </header>
          ${candidatesHtml}
        </section>
      `;
    })
    .join("");
}

function render(state: ResearchState): void {
  renderProjects(state);
  renderGroups(state);
}

async function withPersistedState(
  transform: (state: ResearchState) => ResearchState,
): Promise<void> {
  const nextState = transform(currentState);
  await persistState(nextState);
  render(nextState);
}

async function getCurrentTabCandidateDraft(): Promise<CandidateDraft | null> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (!tab?.url || !tab.url.startsWith("http")) {
    return null;
  }

  const fallback: ProductPageData = {
    title: tab.title?.trim() || "Untitled Product",
    price: "",
    url: tab.url,
    image: tab.favIconUrl ?? "",
    isProductPage: false,
    score: 0,
  };

  if (!tab.id) {
    return {
      title: fallback.title,
      price: fallback.price,
      url: fallback.url,
      image: fallback.image,
    };
  }

  try {
    const message: ExtensionMessage = { type: "extract-product" };
    const response = await browser.tabs.sendMessage(tab.id, message);
    const product = (response as ProductPageData | undefined) ?? fallback;

    return {
      title: product.title || fallback.title,
      price: product.price,
      url: product.url || fallback.url,
      image: product.image,
    };
  } catch {
    return {
      title: fallback.title,
      price: fallback.price,
      url: fallback.url,
      image: fallback.image,
    };
  }
}

async function handleSaveCurrentPage(): Promise<void> {
  const draft = await getCurrentTabCandidateDraft();
  if (!draft) {
    setStatus("Open a regular web page to save a candidate.");
    return;
  }

  await withPersistedState((state) =>
    addCandidateToProject(state, state.activeProjectId, draft),
  );

  setStatus("Candidate saved.");
}

function findCandidateContext(element: HTMLElement): {
  groupId: string;
  candidateId: string;
} | null {
  const candidateNode = element.closest<HTMLElement>(".candidate");
  if (!candidateNode) {
    return null;
  }

  const groupId = candidateNode.dataset.groupId;
  const candidateId = candidateNode.dataset.candidateId;
  if (!groupId || !candidateId) {
    return null;
  }

  return { groupId, candidateId };
}

async function initPopup(): Promise<void> {
  currentState = await readState();
  render(currentState);

  projectSelectNode.addEventListener("change", () => {
    void withPersistedState((state) =>
      selectActiveProject(state, projectSelectNode.value),
    );
  });

  createProjectNode.addEventListener("click", () => {
    const name = window.prompt("Project name", "New research project");
    if (!name) {
      return;
    }

    void withPersistedState((state) => addProject(state, name));
  });

  renameProjectNode.addEventListener("click", () => {
    const activeProject = getActiveProject(currentState);
    const name = window.prompt("Rename project", activeProject.name);
    if (!name) {
      return;
    }

    void withPersistedState((state) =>
      renameProject(state, activeProject.id, name),
    );
  });

  deleteProjectNode.addEventListener("click", () => {
    const activeProject = getActiveProject(currentState);
    if (!window.confirm(`Delete project "${activeProject.name}"?`)) {
      return;
    }

    void withPersistedState((state) => deleteProject(state, activeProject.id));
  });

  saveCurrentPageNode.addEventListener("click", () => {
    void handleSaveCurrentPage();
  });

  groupsListNode.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const action = target.dataset.action;

    if (action === "toggle-group") {
      const groupId = target.dataset.groupId;
      if (!groupId) {
        return;
      }

      void withPersistedState((state) =>
        toggleGroupCollapse(state, state.activeProjectId, groupId),
      );
      return;
    }

    const context = findCandidateContext(target);
    if (!context) {
      return;
    }

    if (action === "rename-candidate") {
      const title = window.prompt("Rename candidate");
      if (!title) {
        return;
      }

      void withPersistedState((state) =>
        updateCandidate(
          state,
          state.activeProjectId,
          context.groupId,
          context.candidateId,
          { title },
        ),
      );
      return;
    }

    if (action === "delete-candidate") {
      void withPersistedState((state) =>
        deleteCandidate(
          state,
          state.activeProjectId,
          context.groupId,
          context.candidateId,
        ),
      );
      return;
    }

    if (action === "save-notes") {
      const notesArea = groupsListNode.querySelector<HTMLTextAreaElement>(
        `textarea[data-notes-for="${context.candidateId}"]`,
      );

      void withPersistedState((state) =>
        updateCandidate(
          state,
          state.activeProjectId,
          context.groupId,
          context.candidateId,
          { notes: notesArea?.value ?? "" },
        ),
      );
      setStatus("Notes updated.");
    }
  });
}

void initPopup();
