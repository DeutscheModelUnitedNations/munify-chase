import { exists, rm } from "node:fs/promises";
import { join } from "node:path";
import { build } from "esbuild";

console.info("Building...");

const clientDir = import.meta.dir;
const outDir = join(clientDir, "out");
const srcDir = join(clientDir, "src");

if (await exists(outDir)) {
  console.info(`Removing old build dir ${outDir}`);
  await rm(outDir, { recursive: true });
}

const r = await build({
  entryPoints: [join(srcDir, "main.ts")],
  bundle: true,
  platform: "node",
  target: ["node21.6"],
  outdir: "./out",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: true,
  loader: { ".mjml": "file" },
});

if (!r.errors && r.errors) {
  console.error(r.errors);
  throw new Error("Build unsuccessful!");
}
if (r.warnings.length > 0) {
  console.warn(r.warnings);
}
console.info("Done!");
