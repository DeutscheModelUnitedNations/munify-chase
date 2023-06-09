import { NowRequestHandler } from "fastify-now";
import { authenticated } from "../../hooks/auth";
import { Type } from "@sinclair/typebox";

export const GET: NowRequestHandler<{}> = async () => {};

GET.opts = {
  onRequest: authenticated,
  schema: {
    description: "Check the authentication status of the user calling this method.",
    response: {
      200: Type.Null(),
      401: Type.Literal("Unauthorized"),
    },
  },
};
