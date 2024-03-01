import { t, Elysia } from "elysia";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import {
  AgendaItem,
  Committee,
  CommitteeMember,
  Conference,
  ConferenceMember,
  Delegation,
  Email,
  User,
} from "../../prisma/generated/schema";
import { Value } from "@sinclair/typebox/value";
import { db } from "../../prisma/db";
import { recursiveNullFieldsToUndefined } from "../util/nullToUndefined";
import { recursiveDateFieldsToString } from "../util/dateToString";

//TODO ensure to other conferences can be edited when importing again

const Data = t.Composite([
  t.Omit(Conference, [
    "committees",
    "delegations",
    "members",
    "researchServiceMessagees",
  ]),
  t.Object({
    committees: t.Array(
      t.Composite([
        t.Omit(Committee, [
          "conference",
          "conferenceId",
          "members",
          "parent",
          "subCommittees",
          "messages",
          "agendaItems",
        ]),
        t.Object({
          members: t.Array(
            t.Omit(CommitteeMember, [
              "committee",
              "committeeId",
              "user",
              "speakerLists",
              "delegation",
              "presence",
            ]),
          ),
          agendaItems: t.Array(
            t.Omit(AgendaItem, ["committee", "speakerLists"]),
          ),
        }),
      ]),
    ),
    members: t.Array(
      t.Composite([
        t.Omit(ConferenceMember, [
          "conference",
          "conferenceId",
          "user",
          "nonStateActor",
        ]),
        t.Object({
          user: t.Optional(
            t.Composite([
              t.Omit(User, [
                "conferenceMemberships",
                "committeeMemberships",
                "messages",
                "emails",
                "passwords",
                "pendingCredentialCreationTasks",
              ]),
              t.Object({
                emails: t.Array(
                  t.Omit(Email, [
                    "user",
                    "userId",
                    "validationToken",
                    "validationTokenId",
                  ]),
                ),
              }),
            ]),
          ),
        }),
      ]),
    ),
    delegations: t.Array(
      t.Omit(Delegation, ["conference", "conferenceId", "nation", "members"]),
    ),
  }),
]);

export const committee = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .post(
    "/export",
    async ({ params: { conferenceId } }) => {
      const res = await db.conference.findUniqueOrThrow({
        where: { id: conferenceId },
        include: {
          committees: {
            include: {
              members: {
                select: {
                  id: true,
                  userId: true,
                  delegationId: true,
                },
              },
              agendaItems: true,
            },
          },
          members: {
            include: {
              user: {
                include: {
                  emails: {
                    select: {
                      email: true,
                      validated: true,
                    },
                  },
                },
              },
            },
          },
          delegations: true,
        },
      });

      Value.Clean(Data, res);
      return recursiveNullFieldsToUndefined(recursiveDateFieldsToString(res));
    },
    {
      hasConferenceRole: ["ADMIN"],
      response: Data,
      detail: {
        description: "Export the conference data",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/import",
    async ({ params: { conferenceId }, body }) => {
      //@ts-ignore
      body.id = undefined;

      db.$transaction(async (tx) => {
        await tx.conference.update({
          where: { id: conferenceId },
          data: {
            committees: {
              upsert: body.committees.map((committee) => ({
                where: {
                  id: committee.id,
                },
                create: {
                  ...committee,
                  members: {
                    connectOrCreate: committee.members.map((member) => ({
                      where: { id: member.id },
                      create: member,
                      update: member,
                    })),
                  },
                  agendaItems: {
                    connectOrCreate: committee.agendaItems.map(
                      (agendaItem) => ({
                        where: { id: agendaItem.id },
                        create: agendaItem,
                        update: agendaItem,
                      }),
                    ),
                  },
                },
                update: {
                  ...committee,
                  members: {
                    connectOrCreate: committee.members.map((member) => ({
                      where: { id: member.id },
                      create: member,
                      update: member,
                    })),
                  },
                  agendaItems: {
                    connectOrCreate: committee.agendaItems.map(
                      (agendaItem) => ({
                        where: { id: agendaItem.id },
                        create: agendaItem,
                        update: agendaItem,
                      }),
                    ),
                  },
                },
              })),
            },
            members: {
              upsert: body.members.map((member) => ({
                where: { id: member.id },
                create: {
                  role: member.role,
                  user:
                    member.user !== undefined
                      ? {
                          connectOrCreate: {
                            where: { id: member.user.id },
                            create: {
                              ...member.user,
                              emails: {
                                create: member.user.emails,
                              },
                            },
                          },
                        }
                      : undefined,
                },
                update: {
                  role: member.role,
                  user:
                    member.user !== undefined
                      ? {
                          connectOrCreate: {
                            where: { id: member.user.id },
                            create: {
                              ...member.user,
                              emails: {
                                create: member.user.emails,
                              },
                            },
                          },
                        }
                      : undefined,
                },
              })),
            },
          },
          include: {
            committees: {
              include: {
                members: true,
                agendaItems: true,
              },
            },
            members: {
              include: {
                user: {
                  include: { emails: true },
                },
              },
            },
          },
        });

        //TODO we cannot upsert certain entities. Everything above which is created by
        // connectOrCreate needs to be updaten in case of a data change!
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: Data,
      detail: {
        description: "Import the conference data",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
