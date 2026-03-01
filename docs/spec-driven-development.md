# Spec-Driven Development

This repository uses a lightweight spec-driven workflow for non-trivial changes.

The governing engineering rules for that workflow are defined in `docs/constitution.md`.

## When To Write A Spec

Write a spec when the change:

- changes user-visible behavior
- affects architecture, workflows, or automation
- introduces new dependencies or tooling
- spans multiple files or multiple implementation steps

Skip the full process only for small, obvious edits.

## Workflow

1. Create a spec scaffold:

   ```bash
   npm run spec:new -- <feature-name>
   ```

2. Complete `spec.md` before implementation.
3. Break the work into executable steps in `tasks.md`.
4. Capture decisions, open questions, and follow-ups in `notes.md`.
5. Implement only after the spec is coherent.
6. Reference the spec in the pull request.
7. Ensure the implementation still complies with `docs/constitution.md`.

## Structure

Each spec lives in `specs/<feature-slug>/` and contains:

- `spec.md`: problem, goals, constraints, acceptance criteria
- `tasks.md`: ordered implementation checklist
- `notes.md`: decisions, risks, follow-ups

## Quality Bar

A spec is ready when:

- the problem is concrete
- non-goals are explicit
- acceptance criteria are testable
- risks are identified
- implementation tasks are small and clear
