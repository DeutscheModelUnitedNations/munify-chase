import { server } from "@/api/server";
import { Elysia } from "elysia";

// this is a simple wrapper around the api
const app = new Elysia({ prefix: "/api" }).use(server);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
export const HEAD = app.handle;
export const OPTIONS = app.handle;
export const TRACE = app.handle;
export const CONNECT = app.handle;
