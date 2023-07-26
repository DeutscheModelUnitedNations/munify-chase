import {NowRequestHandler} from "fastify-now";
import {authenticated} from "../hooks/auth";
import z from "zod";

//TODO change to absolute path
import {db} from "../../prisma/client";
import {
  ConferenceCreateInputSchema,
  ConferenceSchema,
} from "../../prisma/generated/zod";
import {makeEndpoint} from "../util/endpointMaker";

export const POST = makeEndpoint({
  beforeRequestHook: authenticated,
  description: "Create a conference",
  requestSchema: z.object({
    token: z.string().describe("The creation token required to create a conference. Will be consumed on use."),
    conference: ConferenceCreateInputSchema.describe("The conference to create."),
  }),
  replySchema: ConferenceSchema,
  handler: async (req) => {
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
  }
});