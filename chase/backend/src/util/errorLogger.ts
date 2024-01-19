import Elysia from "elysia";

export const errorLogging = new Elysia().onError(({ error, code, path }) => {
  console.error(`Error in ${path}: ${code} ${error.message}`);

  if (code === "VALIDATION") {
    return error.message;
  }

  if (code === "NOT_FOUND") {
    return `Path ${path} doesn't exist (${error.message})`;
  }

  return "Internal server error";
});
