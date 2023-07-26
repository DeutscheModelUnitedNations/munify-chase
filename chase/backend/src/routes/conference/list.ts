import {NowRequestHandler} from "fastify-now";
import {authenticated} from "../../hooks/auth";
import z from "zod";

//TODO change to absolute path
import {db} from "../../../prisma/client";
import {ConferenceSchema} from "../../../prisma/generated/zod";
import {makeEndpoint} from "../../util/endpointMaker";

export const GET = makeEndpoint({
  description: "List all available conferences",
  beforeRequestHook: authenticated,
  replySchema: z.array(ConferenceSchema),
  handler: async () => {
    return await db.conference.findMany();
  },
});