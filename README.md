# Chrome Extension Example (TypeScript + WXT)

This project is a minimal Chrome extension built with TypeScript and WXT.

Features:

- Clicking the extension button opens a popup.
- The popup shows:
  - the current time, updated every second
  - the time when the popup was opened
  - a counter of how many times the popup has been opened
- The same counter is also shown on the extension button badge.

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

3. Lint the project:

   ```bash
   npm run lint
   ```

4. Format the project:

   ```bash
   npm run format
   ```

5. Check formatting in CI/local:

   ```bash
   npm run format:check
   ```

6. Install Git hooks:

   ```bash
   npm run prepare
   ```

7. Install the Playwright browser for e2e tests:

   ```bash
   npx playwright install chromium
   ```

8. Run unit tests:

   ```bash
   npm run test:run
   ```

9. Generate coverage:

   ```bash
   npm run test:coverage
   ```

10. Run e2e tests:

```bash
npm run test:e2e
```

11. Open Chrome and go to `chrome://extensions`.
12. Enable **Developer mode**.
13. Click **Load unpacked** and select `.output/chrome-mv3`.
