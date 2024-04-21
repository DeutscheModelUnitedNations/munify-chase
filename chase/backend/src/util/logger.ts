import Elysia from "elysia";

export const logger = new Elysia({
  name: "logger",
})
  .onBeforeHandle({ as: "global" }, ({ request, path }) => {
    console.info(`Received request ${request.method} ${path}`);
  })
  .onError({ as: "global" }, ({ error, code, path, set, request }) => {
    console.error(
      `Error in ${request.method} ${path}: ${code} ${error.message}. Thrown at ${error.stack}`,
    );

    if (code === "VALIDATION") {
      return error.message;
    }

    if (code === "NOT_FOUND") {
      return `Path ${path} doesn't exist (${error.message})`;
    }

    if (set.status === "Unavailable For Legal Reasons") {
      return error;
    }

    if (set.status === "Unauthorized") {
      return error;
    }

    // biome-ignore lint/suspicious/noExplicitAny:
    if ((error as any).response === "Permission check failed.") {
      set.status = "Unauthorized";
      // biome-ignore lint/suspicious/noExplicitAny:
      return (error as any).response;
    }

    // prisma relation/entry not found
    // @ts-ignore
    if (error?.code === "P2025") {
      set.status = "Not Found";
      return error;
    }

    // prisma unique constraint failed
    // @ts-ignore
    if (error?.code === "P2002") {
      set.status = "Conflict";
      return error;
    }

    console.error(JSON.stringify(error));

    return "Internal server error";
  });
