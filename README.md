# Shopping Research Helper (TypeScript + WXT)

This project is a Chrome extension built with TypeScript and WXT.

Features:

- Save product candidates from the current page
- Organize work in research projects
- Group candidates by normalized product model
- Manage candidate notes, title updates, and deletion
- Add candidates from selected text via context menu
- In-page prompt on detected product pages

## Spec-Driven Development

This repo includes a lightweight spec-driven workflow for non-trivial changes.

- Specs live in `specs/`
- Process guidance lives in `docs/spec-driven-development.md`
- Engineering rules live in `docs/constitution.md`
- Create a new spec scaffold with:

  ```bash
  npm run spec:new -- <feature-name>
  ```

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the extension:

   ```bash
   npm run build
   ```

3. Run the same validation steps as CI:

   ```bash
   npm run ci
   ```

4. Lint the project:

   ```bash
   npm run lint
   ```

5. Format the project:

   ```bash
   npm run format
   ```

6. Check formatting in CI/local:

   ```bash
   npm run format:check
   ```

7. Install Git hooks:

   ```bash
   npm run prepare
   ```

8. Install the Playwright browser for e2e tests:

   ```bash
   npx playwright install chromium
   ```

9. Run unit tests:

   ```bash
   npm run test:run
   ```

10. Generate coverage:

```bash
npm run test:coverage
```

11. Run e2e tests:

```bash
npm run test:e2e
```

12. Open Chrome and go to `chrome://extensions`.
13. Enable **Developer mode**.
14. Click **Load unpacked** and select `.output/chrome-mv3`.
