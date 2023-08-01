import {NowRequestHandler} from "fastify-now";
import {authenticated} from "../../hooks/auth";
import z from "zod";

//TODO NO-119 change to absolute path
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
  const [_, newConference] = await db.$transaction([
    // try to delete the token, throws if not found
    db.conferenceCreateToken.delete({
      where: {
        token: req.body.token
      }
    }),
    // if deletion worked, create a new conference
    db.conference.create({
      data: req.body.conference,
    })
  ]);

  try {
    await req.session.permissions.setConferenceAdmin(newConference.id);
  } catch (error) {
    await db.conference.delete({where: {id: newConference.id}});
    console.error(error);
  }

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
