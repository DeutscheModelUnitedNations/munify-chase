import {NowRequestHandler} from "fastify-now";
import {authenticated} from "../../hooks/auth";
import z from "zod";

//TODO change to absolute path
import {db} from "../../../prisma/client";
import {
  ConferenceCreateInputSchema,
  ConferenceSchema,
} from "../../../prisma/generated/zod";

const Request = z.object({
  token: z.string().describe("The creation token required to create a conference. Will be consumed on use."),
  conference: ConferenceCreateInputSchema.describe("The conference to create."),
});
type RequestType = z.infer<typeof Request>;

const Reply = ConferenceSchema;
type ReplyType = z.infer<typeof Reply>;

export const POST: NowRequestHandler<{
  Body: RequestType;
  Reply: ReplyType;
}> = async (req) => {

  // try to delete the token, throws if not found
  await db.conferenceCreateToken.delete({
    where: {
      token: req.body.token
    }
  });

  const newConference = await db.conference.create({
    data: req.body.conference,
  });

  await req.session.grants.setConferenceAdmin(newConference.id);

  return newConference;
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
