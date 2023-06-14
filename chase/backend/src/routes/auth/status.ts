import { NowRequestHandler } from "fastify-now";
import { authenticated } from "../../hooks/auth";

export const GET: NowRequestHandler<{}> = async () => {};

GET.opts = {
  preHandler: authenticated,
};
