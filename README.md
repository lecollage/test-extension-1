# Chrome Extension Example (TypeScript + WXT)

This project is a minimal Chrome extension built with TypeScript and WXT.

Features:

- Clicking the extension button opens a popup.
- The popup shows:
  - the current time, updated every second
  - the time when the popup was opened
  - a counter of how many times the popup has been opened
- The same counter is also shown on the extension button badge.

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

4. Install the Playwright browser for e2e tests:

   ```bash
   npx playwright install chromium
   ```

5. Run unit tests:

   ```bash
   npm run test:run
   ```

6. Generate coverage:

   ```bash
   npm run test:coverage
   ```

7. Run e2e tests:

   ```bash
   npm run test:e2e
   ```

8. Open Chrome and go to `chrome://extensions`.
9. Enable **Developer mode**.
10. Click **Load unpacked** and select `.output/chrome-mv3`.
