import { describe, expect, it } from "vitest";

import {
  addCandidateToProject,
  addProject,
  createInitialResearchState,
  deleteCandidate,
  deleteProject,
  deriveGroup,
  getActiveProject,
  renameProject,
  toggleGroupCollapse,
  updateCandidate,
} from "./research";

describe("research state", () => {
  it("creates a default initial state", () => {
    const state = createInitialResearchState();

    expect(state.projects).toHaveLength(1);
    expect(state.activeProjectId).toBe(state.projects[0].id);
  });

  it("adds, renames, and deletes projects", () => {
    const initial = createInitialResearchState();
    const withProject = addProject(initial, "Monitor Research");

    expect(withProject.projects).toHaveLength(2);
    expect(getActiveProject(withProject).name).toBe("Monitor Research");

    const renamed = renameProject(
      withProject,
      withProject.activeProjectId,
      "Display Research",
    );
    expect(getActiveProject(renamed).name).toBe("Display Research");

    const deleted = deleteProject(renamed, renamed.activeProjectId);
    expect(deleted.projects).toHaveLength(1);
  });

  it("adds candidates and deduplicates by URL", () => {
    const initial = createInitialResearchState();
    const withCandidate = addCandidateToProject(
      initial,
      initial.activeProjectId,
      {
        title: "Ergotron LX Monitor Arm",
        url: "https://example.com/p/ergotron",
        price: "$59",
      },
    );

    const project = getActiveProject(withCandidate);
    expect(project.groups).toHaveLength(1);
    expect(project.groups[0].candidates).toHaveLength(1);

    const deduped = addCandidateToProject(
      withCandidate,
      withCandidate.activeProjectId,
      {
        title: "Ergotron LX Monitor Arm",
        url: "https://example.com/p/ergotron",
        price: "$61",
      },
    );

    const dedupedProject = getActiveProject(deduped);
    expect(dedupedProject.groups[0].candidates).toHaveLength(1);
    expect(dedupedProject.groups[0].candidates[0].price).toBe("$61");
  });

  it("updates candidate content and deletes candidates", () => {
    const initial = createInitialResearchState();
    const withCandidate = addCandidateToProject(
      initial,
      initial.activeProjectId,
      {
        title: "KVM Switch 4K",
        url: "https://example.com/kvm",
      },
    );

    const project = getActiveProject(withCandidate);
    const group = project.groups[0];
    const candidate = group.candidates[0];

    const withUpdates = updateCandidate(
      withCandidate,
      withCandidate.activeProjectId,
      group.id,
      candidate.id,
      {
        title: "KVM Switch 4K HDMI",
        notes: "Check USB-C support",
      },
    );

    const updatedCandidate =
      getActiveProject(withUpdates).groups[0].candidates[0];
    expect(updatedCandidate.title).toBe("KVM Switch 4K HDMI");
    expect(updatedCandidate.notes).toBe("Check USB-C support");

    const withoutCandidate = deleteCandidate(
      withUpdates,
      withUpdates.activeProjectId,
      group.id,
      candidate.id,
    );

    expect(getActiveProject(withoutCandidate).groups).toHaveLength(0);
  });

  it("toggles group collapse state", () => {
    const initial = createInitialResearchState();
    const withCandidate = addCandidateToProject(
      initial,
      initial.activeProjectId,
      {
        title: "Logitech MX Keys",
        url: "https://example.com/mx-keys",
      },
    );

    const group = getActiveProject(withCandidate).groups[0];
    const toggled = toggleGroupCollapse(
      withCandidate,
      withCandidate.activeProjectId,
      group.id,
    );

    expect(getActiveProject(toggled).groups[0].isCollapsed).toBe(true);
  });

  it("derives stable group keys and labels", () => {
    expect(deriveGroup("Ergotron LX Monitor Arm")).toEqual({
      key: "ergotron-lx-monitor",
      label: "Ergotron LX Monitor",
    });
  });
});
