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

3. Run unit tests:

   ```bash
   npm run test:run
   ```

4. Generate coverage:

   ```bash
   npm run test:coverage
   ```

5. Open Chrome and go to `chrome://extensions`.
6. Enable **Developer mode**.
7. Click **Load unpacked** and select `.output/chrome-mv3`.
