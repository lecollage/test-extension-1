import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function toSlug(value) {
  const normalized = value.trim().toLowerCase();
  const characters = [];
  let previousWasSeparator = false;

  for (const char of normalized) {
    const isAlphaNumeric =
      (char >= "a" && char <= "z") || (char >= "0" && char <= "9");

    if (isAlphaNumeric) {
      characters.push(char);
      previousWasSeparator = false;
      continue;
    }

    if (!previousWasSeparator && characters.length > 0) {
      characters.push("-");
      previousWasSeparator = true;
    }
  }

  if (characters.at(-1) === "-") {
    characters.pop();
  }

  return characters.join("");
}

async function loadTemplate(templateName) {
  return readFile(path.resolve("specs", "templates", templateName), "utf8");
}

function fillTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (content, [needle, value]) => content.replaceAll(needle, value),
    template,
  );
}

async function main() {
  const rawName = process.argv[2];

  if (!rawName) {
    console.error("Usage: npm run spec:new -- <feature-name>");
    process.exitCode = 1;
    return;
  }

  const slug = toSlug(rawName);
  if (!slug) {
    console.error(
      "The provided feature name is empty after slug normalization.",
    );
    process.exitCode = 1;
    return;
  }

  const specDir = path.resolve("specs", slug);
  await mkdir(specDir, { recursive: true });

  const [specTemplate, tasksTemplate, notesTemplate] = await Promise.all([
    loadTemplate("spec-template.md"),
    loadTemplate("tasks-template.md"),
    loadTemplate("notes-template.md"),
  ]);

  const replacements = {
    "{{FEATURE_NAME}}": rawName.trim(),
    "{{FEATURE_SLUG}}": slug,
  };

  await Promise.all([
    writeFile(
      path.join(specDir, "spec.md"),
      fillTemplate(specTemplate, replacements),
      {
        flag: "wx",
      },
    ),
    writeFile(
      path.join(specDir, "tasks.md"),
      fillTemplate(tasksTemplate, replacements),
      {
        flag: "wx",
      },
    ),
    writeFile(
      path.join(specDir, "notes.md"),
      fillTemplate(notesTemplate, replacements),
      {
        flag: "wx",
      },
    ),
  ]);

  console.log(`Created spec scaffold in specs/${slug}`);
}

await main();
