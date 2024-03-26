import Elysia from "elysia";

// if available we should also log the user info etc. and to something agains these
// verbose blocks of code in out logs
// TODO we should also add general logging for all requests
export const errorLogging = new Elysia({
  name: "errorLogging",
}).onError({ as: "global" }, ({ error, code, path, set, request }) => {
  console.error(
    `Error in ${request.method} ${path}: ${code} ${error.message}. Thrown at ${error.stack}`
  );

  if (code === "VALIDATION") {
    return error.message;
  }

  if (code === "NOT_FOUND") {
    return `Path ${path} doesn't exist (${error.message})`;
  }

  console.error(JSON.stringify(error));

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

  return "Internal server error";
});
