import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Compile the actual server component in memory; no app configuration is changed.
const cache = new Map();
function loadSource(relative) {
  const filename = path.resolve(relative);
  if (cache.has(filename)) return cache.get(filename);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
  const compiledModule = { exports: {} };
  const require = createRequire(filename);
  const resolve = specifier => {
    if (specifier.startsWith("@/")) {
      const relativePath = specifier.slice(2);
      return loadSource(`${relativePath}${relativePath.startsWith("components/") ? ".tsx" : ".ts"}`);
    }
    return require(specifier);
  };
  new Function("require", "module", "exports", compiled)(resolve, compiledModule, compiledModule.exports);
  cache.set(filename, compiledModule.exports);
  return compiledModule.exports;
}
const { CreatorCredit } = loadSource("components/creator-credit.tsx");
const { creator } = loadSource("config/creator.ts");
const props = process.argv[2] ? { profile: { ...creator, portfolioUrl: process.argv[2] === "--no-portfolio" ? null : process.argv[2] } } : {};
process.stdout.write(renderToStaticMarkup(createElement(CreatorCredit, props)));
