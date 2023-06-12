const { build } = require("esbuild");
const path = require("path");
const fs = require("fs");

//TODO document that the built server only correctly registers routes on unix platforms

const OUTDIR = path.join(__dirname, "build");

fs.rmSync(OUTDIR, {recursive: true, force: true});

/**
 * @param {string} dir The start directory to traverse
 * @returns An array of files recursively in the start directory
 */
function listFiles(dir) {
  let fileArray = [];

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const subdirectoryFiles = listFiles(filePath); // Recursive call for subdirectories
      fileArray = fileArray.concat(subdirectoryFiles);
    } else {
      fileArray.push(filePath); // Add file path to array
    }
  });

  return fileArray;
}

// ╔══════════════════╗
// ║ Build the server ║
// ╚══════════════════╝

const entryPoints = [path.join(__dirname, "src", "main.ts"), ...listFiles(path.join(__dirname, "src", "routes"))];

build({
  entryPoints,
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "es2022",
  // minify: true,
  outdir: OUTDIR,
  define: {
    PRODUCTION: "true",
  }
}).catch((error) => {
  console.error(error);
  process.exit(1);
});