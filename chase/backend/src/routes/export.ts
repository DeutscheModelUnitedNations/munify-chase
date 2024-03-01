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
          members: t.Omit(CommitteeMember, [
            "committee",
            "user",
            "speakerLists",
            "delegation",
            "presence",
          ]),
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
        t,
        Object({
          user: t.Composite([
            t.Omit(User, [
              "conferenceMemberships",
              "committeeMemberships",
              "researchServiceMessages",
              "chairMessages",
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
              members: true,
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
  );
