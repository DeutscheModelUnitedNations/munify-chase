import { exists, rm } from "node:fs/promises";
import { join } from "node:path";

console.info("Building...");

const clientDir = import.meta.dir;
const outDir = join(clientDir, "out");
const srcDir = join(clientDir, "src");

if (await exists(outDir)) {
  console.info(`Removing old build dir ${outDir}`);
  await rm(outDir, { recursive: true });
}

const output = await Bun.build({
  entrypoints: [join(srcDir, "main.ts")],
  outdir: "./out",
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: true,
});
if (!output.success) {
  console.error(output.logs);
} else {
  console.info("Done!");
}
