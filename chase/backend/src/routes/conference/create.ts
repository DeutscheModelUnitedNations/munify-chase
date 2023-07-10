import { NowRequestHandler } from "fastify-now";
import { authenticated } from "../../hooks/auth";
import z from "zod";

//TODO change to absolute path
import { db } from "../../../prisma/client";
import {
  ConferenceCreateInputSchema,
  ConferenceSchema,
} from "../../../prisma/generated/zod";

const Request = ConferenceCreateInputSchema;
type RequestType = z.infer<typeof Request>;

const Reply = ConferenceSchema;
type ReplyType = z.infer<typeof Reply>;

export const POST: NowRequestHandler<{
  Body: RequestType;
  Reply: ReplyType;
}> = async (req) => {
  return await db.conference.create({
    data: req.body,
  });
};

POST.opts = {
    onRequest: authenticated,
  schema: {
    description: "List all available conferences",
    body: Request,
    response: {
      200: Reply,
    },
  },
};
