import { NowRequestHandler } from "fastify-now";
import { authenticated } from "src/hooks/auth";

export const GET: NowRequestHandler<{}> = async () => {};

GET.opts = {
  preHandler: authenticated,
};
