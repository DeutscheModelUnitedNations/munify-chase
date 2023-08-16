import { NowRequestHandler } from "fastify-now";
import { authenticated } from "../../hooks/auth";
import z from "zod";

//TODO change to absolute path
import { db } from "../../../prisma/client";
import { ConferenceSchema } from "../../../prisma/generated/zod";

const Reply = z.array(ConferenceSchema);
type ReplyType = z.infer<typeof Reply>;

export const GET: NowRequestHandler<{
  Reply: ReplyType;
}> = async () => {
  return await db.conference.findMany();
};

GET.opts = {
  onRequest: authenticated,
  schema: {
    description: "List all available conferences",
    response: {
      200: Reply,
    },
  },
};
