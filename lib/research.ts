export const RESEARCH_STORAGE_KEY = "shoppingResearchState";

export interface Candidate {
  id: string;
  title: string;
  price: string;
  url: string;
  image: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateGroup {
  id: string;
  key: string;
  label: string;
  isCollapsed: boolean;
  candidates: Candidate[];
}

export interface ResearchProject {
  id: string;
  name: string;
  groups: CandidateGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchState {
  projects: ResearchProject[];
  activeProjectId: string;
}

export interface CandidateDraft {
  title: string;
  url: string;
  price?: string;
  image?: string;
  notes?: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

let idCounter = 0;

function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}

function createProject(name: string): ResearchProject {
  const timestamp = nowIso();
  return {
    id: createId("project"),
    name,
    groups: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createInitialResearchState(): ResearchState {
  const project = createProject("My First Research");
  return {
    projects: [project],
    activeProjectId: project.id,
  };
}

export function ensureResearchState(value: unknown): ResearchState {
  if (!value || typeof value !== "object") {
    return createInitialResearchState();
  }

  const candidate = value as Partial<ResearchState>;
  if (!Array.isArray(candidate.projects) || candidate.projects.length === 0) {
    return createInitialResearchState();
  }

  const projects = candidate.projects.filter(isProject);
  if (projects.length === 0) {
    return createInitialResearchState();
  }

  const activeProjectId =
    typeof candidate.activeProjectId === "string" &&
    projects.some((project) => project.id === candidate.activeProjectId)
      ? candidate.activeProjectId
      : projects[0].id;

  return {
    projects,
    activeProjectId,
  };
}

function isProject(project: unknown): project is ResearchProject {
  if (!project || typeof project !== "object") {
    return false;
  }

  const candidate = project as Partial<ResearchProject>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    Array.isArray(candidate.groups) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function getActiveProject(state: ResearchState): ResearchProject {
  return (
    state.projects.find((project) => project.id === state.activeProjectId) ??
    state.projects[0]
  );
}

export function selectActiveProject(
  state: ResearchState,
  projectId: string,
): ResearchState {
  if (!state.projects.some((project) => project.id === projectId)) {
    return state;
  }

  return {
    ...state,
    activeProjectId: projectId,
  };
}

export function addProject(state: ResearchState, name: string): ResearchState {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return state;
  }

  const project = createProject(trimmedName);
  return {
    projects: [...state.projects, project],
    activeProjectId: project.id,
  };
}

export function renameProject(
  state: ResearchState,
  projectId: string,
  name: string,
): ResearchState {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return state;
  }

  let hasUpdated = false;
  const projects = state.projects.map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    hasUpdated = true;
    return {
      ...project,
      name: trimmedName,
      updatedAt: nowIso(),
    };
  });

  return hasUpdated ? { ...state, projects } : state;
}

export function deleteProject(
  state: ResearchState,
  projectId: string,
): ResearchState {
  if (state.projects.length === 1) {
    return state;
  }

  const projects = state.projects.filter((project) => project.id !== projectId);
  if (projects.length === state.projects.length) {
    return state;
  }

  const activeProjectId =
    state.activeProjectId === projectId
      ? projects[0].id
      : state.activeProjectId;

  return {
    projects,
    activeProjectId,
  };
}

export function deriveGroup(title: string): { key: string; label: string } {
  const normalizedTitle = title.trim();
  const fallbackLabel = normalizedTitle || "Unknown Product";
  const words = fallbackLabel.split(/\s+/).slice(0, 3);
  const label = words.join(" ");
  const key = words
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  return {
    key: key || "unknown-product",
    label,
  };
}

function upsertCandidateInProject(
  project: ResearchProject,
  draft: CandidateDraft,
): ResearchProject {
  const timestamp = nowIso();
  const title = draft.title.trim() || "Untitled Product";
  const { key, label } = deriveGroup(title);

  const existingGroupIndex = project.groups.findIndex(
    (group) => group.key === key,
  );
  const groupId =
    existingGroupIndex >= 0
      ? project.groups[existingGroupIndex].id
      : createId("group");

  const candidate: Candidate = {
    id: createId("candidate"),
    title,
    price: draft.price?.trim() ?? "",
    url: draft.url,
    image: draft.image?.trim() ?? "",
    notes: draft.notes?.trim() ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (existingGroupIndex === -1) {
    const group: CandidateGroup = {
      id: groupId,
      key,
      label,
      isCollapsed: false,
      candidates: [candidate],
    };

    return {
      ...project,
      groups: [...project.groups, group],
      updatedAt: timestamp,
    };
  }

  const group = project.groups[existingGroupIndex];
  const existingCandidateIndex = group.candidates.findIndex(
    (stored) => stored.url === draft.url,
  );

  const nextCandidates =
    existingCandidateIndex >= 0
      ? group.candidates.map((stored, index) =>
          index === existingCandidateIndex
            ? {
                ...stored,
                title,
                price: candidate.price,
                image: candidate.image,
                notes: candidate.notes,
                updatedAt: timestamp,
              }
            : stored,
        )
      : [...group.candidates, candidate];

  const groups = project.groups.map((storedGroup, index) =>
    index === existingGroupIndex
      ? {
          ...storedGroup,
          label,
          candidates: nextCandidates,
        }
      : storedGroup,
  );

  return {
    ...project,
    groups,
    updatedAt: timestamp,
  };
}

export function addCandidateToProject(
  state: ResearchState,
  projectId: string,
  draft: CandidateDraft,
): ResearchState {
  if (!draft.url.trim()) {
    return state;
  }

  let hasUpdated = false;
  const projects = state.projects.map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    hasUpdated = true;
    return upsertCandidateInProject(project, draft);
  });

  return hasUpdated ? { ...state, projects } : state;
}

export function toggleGroupCollapse(
  state: ResearchState,
  projectId: string,
  groupId: string,
): ResearchState {
  return {
    ...state,
    projects: state.projects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      return {
        ...project,
        updatedAt: nowIso(),
        groups: project.groups.map((group) =>
          group.id === groupId
            ? { ...group, isCollapsed: !group.isCollapsed }
            : group,
        ),
      };
    }),
  };
}

export function updateCandidate(
  state: ResearchState,
  projectId: string,
  groupId: string,
  candidateId: string,
  updates: { title?: string; notes?: string },
): ResearchState {
  const nextTitle = updates.title?.trim();
  const nextNotes = updates.notes?.trim();

  return {
    ...state,
    projects: state.projects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      return {
        ...project,
        updatedAt: nowIso(),
        groups: project.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            candidates: group.candidates.map((candidate) => {
              if (candidate.id !== candidateId) {
                return candidate;
              }

              return {
                ...candidate,
                title: nextTitle || candidate.title,
                notes: nextNotes ?? candidate.notes,
                updatedAt: nowIso(),
              };
            }),
          };
        }),
      };
    }),
  };
}

export function deleteCandidate(
  state: ResearchState,
  projectId: string,
  groupId: string,
  candidateId: string,
): ResearchState {
  return {
    ...state,
    projects: state.projects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      const groups = project.groups
        .map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            candidates: group.candidates.filter(
              (candidate) => candidate.id !== candidateId,
            ),
          };
        })
        .filter((group) => group.candidates.length > 0);

      return {
        ...project,
        groups,
        updatedAt: nowIso(),
      };
    }),
  };
}

export function countCandidates(state: ResearchState): number {
  return state.projects.reduce(
    (sum, project) =>
      sum +
      project.groups.reduce(
        (groupSum, group) => groupSum + group.candidates.length,
        0,
      ),
    0,
  );
}
