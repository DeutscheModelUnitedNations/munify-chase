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

// https://github.com/mjmlio/mjml/issues/2132#issuecomment-1004713444
const emptyMjmlUglifyPlugin = {
  name: "empty mjml uglify plugin",
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setup(build: any) {
    build.onLoad({ filter: /uglify-js\/tools\/node.js$/ }, () => ({
      contents: "{}",
      loader: "js",
    }));
  },
};

const r = await build({
  entryPoints: [join(srcDir, "main.ts")],
  bundle: true,
  platform: "node",
  target: ["node21.6"],
  outdir: "./out",
  format: "esm",
  splitting: false,
  sourcemap: "external",
  minify: false,
  loader: { ".mjml": "file" },
  treeShaking: true,
  plugins: [emptyMjmlUglifyPlugin],
});

if (!r.errors && r.errors) {
  console.error(r.errors);
  throw new Error("Build unsuccessful!");
}
if (r.warnings.length > 0) {
  console.warn(r.warnings);
}
console.info("Done!");
