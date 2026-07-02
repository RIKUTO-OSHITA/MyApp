import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(join(rootDir, relativePath), "utf8");
}

function stripModuleSyntax(source) {
  return source
    .replace(/^import\s*\{[\s\S]*?\}\s*from\s*["'][^"']+["'];\s*$/gm, "")
    .replace(/^export\s+(function|const|class)\b/gm, "$1")
    .trim();
}

const css = [read("src/styles/tokens.css"), read("src/styles/app.css")].join("\n\n");

const js = [read("src/utils/timeSlots.js"), read("src/models/taskStore.js"), read("src/main.js")]
  .map(stripModuleSyntax)
  .join("\n\n");

let html = read("index.html");

html = html.replace(
  /[ \t]*<link rel="stylesheet" href="\.\/src\/styles\/tokens\.css" \/>\r?\n[ \t]*<link rel="stylesheet" href="\.\/src\/styles\/app\.css" \/>/,
  `    <style>\n${css}\n    </style>`
);

html = html.replace(
  /[ \t]*<script type="module" src="\.\/src\/main\.js"><\/script>/,
  `    <script>\n(function () {\n${js}\n})();\n    </script>`
);

mkdirSync(join(rootDir, "dist"), { recursive: true });
writeFileSync(join(rootDir, "dist", "index.html"), html, "utf8");

console.log("Built dist/index.html (self-contained, no server required)");
