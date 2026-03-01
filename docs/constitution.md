# Project Constitution

This document defines the default engineering rules for this repository.

## Core Principles

1. Specification first

Non-trivial changes should start with a written spec before implementation begins.

2. Small, testable increments

Break work into clear, reviewable steps with explicit acceptance criteria.

3. Code and tests move together

Behavioral changes should be accompanied by automated tests or a documented reason why that is not practical.

4. Quality gates stay automated

Linting, unit tests, coverage checks, builds, and e2e verification should remain enforceable through hooks or CI.

5. Documentation is part of the change

If the workflow, architecture, or user-visible behavior changes, the relevant docs should be updated in the same change.

6. Generated artifacts are not the source of truth

Edit source files, config, and specs. Do not treat generated build outputs as canonical.

## Delivery Rules

- Prefer the smallest change that satisfies the spec.
- Keep implementation aligned with the accepted spec; if scope changes, update the spec.
- Record meaningful follow-ups explicitly instead of hiding them in TODO comments.
- Preserve existing quality gates unless there is a deliberate replacement.

## Validation Rules

- Lint must pass.
- Unit tests must pass.
- Coverage thresholds must remain satisfied.
- E2E tests should cover user-visible workflow changes when practical.

## Review Rules

- Pull requests for non-trivial work should reference a spec.
- Acceptance criteria should be traceable to tests or explicit manual checks.
- Reviewers should be able to map code changes back to the spec and task list.

## Amendment Rule

This constitution can be changed, but only through a deliberate pull request that updates the related workflow or templates when needed.
