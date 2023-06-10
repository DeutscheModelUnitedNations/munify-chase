const { build } = require("esbuild");
const path = require("path");
const fs = require("fs");

const OUTDIR = path.join(__dirname, "build");

// ╔══════════════════════════════╗
// ║ Build the server entry point ║
// ╚══════════════════════════════╝

build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  minify: true,
  outdir: OUTDIR,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

// ╔══════════════════╗
// ║ Build each route ║
// ╚══════════════════╝

const routesPath = path.join(__dirname, "src", "routes");
const outputRoutesPath = path.join(OUTDIR, "routes");

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filepath = path.join(dirPath, file);
    const stats = fs.statSync(filepath);

    if (stats.isDirectory()) {
      processDirectory(filepath);
    } else {
      const options = {
        entryPoints: [filepath],
        bundle: true,
        platform: "node",
        minify: true,
        outdir: path.join(
          outputRoutesPath,
          path.dirname(path.relative(routesPath, filepath)),
        ),
      };

      build(options).catch((error) => {
        console.error(error);
        process.exit(1);
      });
    }
  });
}

processDirectory(routesPath);
