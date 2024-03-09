import Elysia from "elysia";

// if available we should also log the user info etc. and to something agains these
// verbose blocks of code in out logs
// TODO we should also add general logging for all requests
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

    if (set.status === "Unavailable For Legal Reasons") {
      return error.message;
    }

    return "Internal server error";
  },
);
