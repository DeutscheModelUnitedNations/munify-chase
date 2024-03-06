import { t, Elysia } from "elysia";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

import { Value } from "@sinclair/typebox/value";
import { db } from "../../../prisma/db";
import { recursiveNullFieldsToUndefined } from "../../util/nullToUndefined";
import { recursiveDateFieldsToString } from "../../util/dateToString";
import { ConferenceExport } from "./exportSchema";
import { ConferenceImport } from "./importSchema";
import { Nation } from "../../../prisma/generated/schema";
import { loggedIn } from "../../auth/guards/loggedIn";

//TODO ensure no other conferences can be edited when importing again

export const importexport = new Elysia()
  .use(conferenceRoleGuard)
  .use(loggedIn)
  .get(
    "/conference/:conferenceId/export",
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

      Value.Clean(ConferenceExport, res);
      return recursiveNullFieldsToUndefined(recursiveDateFieldsToString(res));
    },
    {
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      // hasConferenceRole: ["ADMIN"],
      response: ConferenceExport,
      detail: {
        description: "Export the conference data",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/export-nations",
    async () =>
      db.nation.findMany({
        select: { alpha3Code: true, id: true, variant: true },
      }),
    {
      mustBeLoggedIn: true,
      response: t.Array(t.Pick(Nation, ["alpha3Code", "id", "variant"])),
      detail: {
        description: "Export available nations",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/conference/:conferenceId/import",
    async ({ params: { conferenceId }, body }) => {
      //TODO this isnt optimal
      // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
      if (!Value.Check(ConferenceImport as any, body)) {
        // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
        return Value.Errors(ConferenceImport as any, body);
      }

      body.id = undefined;

      await db.$transaction(async (tx) => {
        return await tx.conference.update({
          where: { id: conferenceId },
          data: {
            ...body,
            committees: {
              // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
              upsert: body.committees.map((committee: any) => ({
                where: {
                  id: committee.id,
                },
                create: {
                  ...committee,
                  members: {
                    // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
                    connectOrCreate: committee.members.map((member: any) => ({
                      where: { id: member.id },
                      create: member,
                    })),
                  },
                  agendaItems: {
                    connectOrCreate: committee.agendaItems.map(
                      // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
                      (agendaItem: any) => ({
                        where: { id: agendaItem.id },
                        create: agendaItem,
                      }),
                    ),
                  },
                },
                update: {
                  ...committee,
                  members: {
                    // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
                    connectOrCreate: committee.members.map((member: any) => ({
                      where: { id: member.id },
                      create: member,
                    })),
                  },
                  agendaItems: {
                    connectOrCreate: committee.agendaItems.map(
                      // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
                      (agendaItem: any) => ({
                        where: { id: agendaItem.id },
                        create: agendaItem,
                      }),
                    ),
                  },
                },
              })),
            },
            members: {
              // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
              upsert: body.members.map((member: any) => ({
                where: { id: member.id },
                create: {
                  role: member.role,
                  user:
                    member.user !== undefined
                      ? {
                          connectOrCreate: {
                            where: {
                              id: member.user.id,
                              emails: {
                                some: {
                                  OR: member.user.emails,
                                },
                              },
                            },
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
                            where: {
                              id: member.user.id,
                              emails: {
                                some: {
                                  OR: member.user.emails,
                                },
                              },
                            },
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
            delegations: {
              // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
              upsert: body.delegations.map((delegation: any) => ({
                where: { id: delegation.id },
                create: delegation,
                update: delegation,
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
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      //TODO
      // hasConferenceRole: ["ADMIN"],
      body: t.Any(),
      detail: {
        description: "Import the conference data",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
