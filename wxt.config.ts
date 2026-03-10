import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Shopping Research Helper",
    version: "1.0.0",
    description:
      "Save product candidates, group variants, and track shopping research projects.",
    permissions: ["storage", "tabs", "contextMenus"],
  },
});
