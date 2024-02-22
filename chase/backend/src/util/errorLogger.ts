import Elysia from "elysia";

export const errorLogging = new Elysia().onError(
  ({ error, code, path, set, request }) => {
    console.error(
      `Error in ${request.method} ${path}: ${code} ${error.message}`,
    );
    console.error(error);

    if (code === "VALIDATION") {
      return error.message;
    }

    if (error.message.includes("Unauthorized")) {
      set.status = "Unauthorized";
      return error.message;
    }

    if (code === "NOT_FOUND") {
      return `Path ${path} doesn't exist (${error.message})`;
    }

    return "Internal server error";
  },
);
