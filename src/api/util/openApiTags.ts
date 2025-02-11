import path from "node:path";

export const allOpenApiTags: { name: string; description?: string }[] = [];

export function openApiTag(filepath: string, description?: string) {
  const tag = path
    .relative(path.join(import.meta.dirname, "..", "routes"), filepath)
    .replace(/\.ts$/, "");
  if (!allOpenApiTags.find((existing) => existing.name === tag)) {
    allOpenApiTags.push({ name: tag, description });
  }

  return tag;
}
