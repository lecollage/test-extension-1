import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Time Popup Counter Example",
    version: "1.0.0",
    description:
      "A TypeScript WXT extension that shows the current time, popup open time, and open counter.",
    permissions: ["storage"],
  },
});
