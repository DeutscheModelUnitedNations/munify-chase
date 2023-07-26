import {authenticated} from "../hooks/auth";
import z from "zod";

//TODO change to absolute path
import {db} from "../../prisma/client";
import {
  ConferenceCreateArgsSchema,
  ConferenceCreateInputSchema,
  ConferenceSchema,
  ConferenceUpdateArgsSchema,
  ConferenceUpdateInputSchema,
} from "../../prisma/generated/zod";
import {makeEndpoint} from "../util/endpointMaker";
import {Permissions} from "auth";

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
      await req.session.permissions.grantConferenceAdmin(newConference.id);
    } catch (error) {
      await db.conference.delete({where: {id: newConference.id}});
      console.error(error);
    }

    return newConference;
  }
});

export const PATCH = makeEndpoint({
  beforeRequestHook: authenticated,
  description: "Update a conference",
  requestSchema: z.object({
    conference: ConferenceUpdateInputSchema.describe("The new conference data"),
    conferenceId: z.number().describe("The id of the conference to update"),
  }),
  handler: async (req) => {
    if (!req.session.permissions.isConferenceAdmin(req.body.conferenceId)) {
      throw new Error("Unauthorized");
    }

    const oldConference = await db.conference.findFirstOrThrow({where: {id: req.body.conferenceId}, include: {admins: true}});

    const newConference = await db.conference.update({
      where: {
        id: req.body.conferenceId,
      },
      data: req.body.conference,
      include: {
        admins: true
      }
    });

    // check removals
    oldConference.admins.forEach(async oldAdmin => {
      if (!newConference.admins.map(n => n.oidcUserId).includes(oldAdmin.oidcUserId)) {
        const removedAdminPermissions = await Permissions.forForeignUser(oldAdmin.oidcUserId);
        await removedAdminPermissions.revokeConferenceAdmin(req.body.conferenceId);
      }
    });

    // check additions
    newConference.admins.forEach(async (newAdmin) => {
      if (!oldConference.admins.map(o => o.oidcUserId).includes(newAdmin.oidcUserId)) {
        const addedAdminPermissions = await Permissions.forForeignUser(newAdmin.oidcUserId);
        await addedAdminPermissions.grantConferenceAdmin(req.body.conferenceId);
      }
    });

    return newConference;
  }
})