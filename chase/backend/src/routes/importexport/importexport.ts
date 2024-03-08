import { t, Elysia } from "elysia";
import { conferenceRoleGuard } from "../../auth/guards/conferenceRoles";
import { openApiTag } from "../../util/openApiTags";

// import { Value } from "@sinclair/typebox/value";
import { db } from "../../../prisma/db";
// import { recursiveNullFieldsToUndefined } from "../../util/nullToUndefined";
// import { recursiveDateFieldsToString } from "../../util/dateToString";
// import { ConferenceExport } from "./exportSchema";
// import { ConferenceImport } from "./importSchema";
import { ConferenceRole } from "../../../prisma/generated/schema";
import { nanoid } from "nanoid";
import { sendCredentialCreationEmail } from "../../email/email";
import { appConfiguration } from "../../util/config";

// //TODO ensure no other conferences can be edited when importing again

export const importexport = new Elysia()
  .use(conferenceRoleGuard)
  .get(
    "/conference/:conferenceId/export-nations",
    async () =>
      db.nation.findMany({
        select: { alpha3Code: true, id: true, variant: true },
      }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Export available nations",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/conference/:conferenceId/import-conference-members",
    async ({ body, params: { conferenceId } }) => {
      console.info(`About to process ${body.length} entries!`);
      const result = await db.$transaction(
        async (tx) => {
          return Promise.allSettled(
            body.map(async (datasetUser) => {
              let userId = (
                await tx.email.findFirst({
                  where: {
                    email: {
                      in: [
                        datasetUser["E-Mail-Adresse 1"],
                        datasetUser["E-Mail-Adresse 2"] ?? "",
                      ],
                    },
                  },
                  include: {
                    user: true,
                  },
                })
              )?.user.id;

              if (!userId) {
                userId = (
                  await tx.user.create({
                    data: {
                      name: datasetUser.Name,
                      emails: {
                        createMany: {
                          skipDuplicates: true,
                          data: [
                            {
                              email: datasetUser["E-Mail-Adresse 1"],
                              validated: true,
                            },
                            {
                              email: datasetUser["E-Mail-Adresse 2"] ?? "",
                              validated: true,
                            },
                          ].filter((e) => e.email !== ""),
                        },
                      },
                    },
                  })
                ).id;

                const token = nanoid(32);
                await tx.pendingCredentialCreateTask.create({
                  data: {
                    token: {
                      create: {
                        tokenHash: await Bun.password.hash(token),
                        expiresAt: new Date(
                          Date.now() + 1000 * 60 * 60 * 24 * 7,
                        ), // 1 week
                      },
                    },
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                  },
                });

                //TODO: report back errors in sending emails to the frontend in structured way
                // the whole sending process should be unified in a function outside the handlers
                // setTimeout(() => {
                //   sendCredentialCreationEmail({
                //     email: datasetUser["E-Mail-Adresse 1"],
                //     locale: "de",
                //     redirectLink: `${appConfiguration.email.CREDENTIAL_CREATE_REDIRECT_URL}?token=${token}&email=${datasetUser["E-Mail-Adresse 1"]}`,
                //   });
                //   console.log("Sent email to", datasetUser["E-Mail-Adresse 1"]);
                // }, 1000 * datasetUserIndex);
              }
              let conferenceMemberId = (
                await tx.conferenceMember.findFirst({
                  where: {
                    conferenceId,
                    role: datasetUser.role,
                    userId: null,
                  },
                })
              )?.id;
              if (!conferenceMemberId) {
                conferenceMemberId = (
                  await tx.conferenceMember.create({
                    data: {
                      conferenceId,
                      role: datasetUser.role,
                    },
                  })
                ).id;
              }
              await tx.conferenceMember.update({
                where: {
                  id: conferenceMemberId,
                },
                data: {
                  userId,
                },
              });
              return { ...datasetUser, userId };
            }),
          );
        },
        {
          timeout: 20000,
        },
      );

      const rejected = result.filter((res) => res.status === "rejected");
      if (rejected.length > 0) {
        console.error(`Failed to process ${rejected.length} entries!`);
        console.error(JSON.stringify(rejected));
      }

      console.info(
        `Successfully processed ${body.length - rejected.length} entries!`,
      );

      return result;
    },
    {
      //TODO
      // hasConferenceRole: ["ADMIN"],
      body: t.Array(
        t.Object({
          Name: t.String(),
          role: ConferenceRole,
          "E-Mail-Adresse 1": t.String({ format: "email" }),
          "E-Mail-Adresse 2": t.Optional(t.String()),
        }),
      ),
      detail: {
        description: "Import conference members",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/conference/:conferenceId/import-committee-members",
    async ({ body, params: { conferenceId } }) => {
      console.info(`About to process ${body.length} entries!`);
      const result = await db.$transaction(
        async (tx) => {
          return Promise.allSettled(
            body.map(async (datasetUser) => {
              let userId = (
                await tx.email.findFirst({
                  where: {
                    email: {
                      in: [datasetUser.mail1, datasetUser.mail2],
                    },
                  },
                  include: {
                    user: true,
                  },
                })
              )?.user.id;

              if (!userId) {
                userId = (
                  await tx.user.create({
                    data: {
                      name: datasetUser.name,
                      emails: {
                        createMany: {
                          skipDuplicates: true,
                          data: [
                            {
                              email: datasetUser.mail1,
                              validated: true,
                            },
                            {
                              email: datasetUser.mail1,
                              validated: true,
                            },
                          ].filter((e) => e.email !== ""),
                        },
                      },
                    },
                  })
                ).id;

                const token = nanoid(32);
                await tx.pendingCredentialCreateTask.create({
                  data: {
                    token: {
                      create: {
                        tokenHash: await Bun.password.hash(token),
                        expiresAt: new Date(
                          Date.now() + 1000 * 60 * 60 * 24 * 7,
                        ), // 1 week
                      },
                    },
                    user: {
                      connect: {
                        id: userId,
                      },
                    },
                  },
                });

                //TODO: report back errors in sending emails to the frontend in structured way
                // the whole sending process should be unified in a function outside the handlers
                await sendCredentialCreationEmail({
                  email: datasetUser.mail1,
                  locale: "de",
                  redirectLink: `${appConfiguration.email.CREDENTIAL_CREATE_REDIRECT_URL}?token=${token}&email=${datasetUser.mail1}`,
                });
              }

              let committeeMemberId = (
                await tx.committeeMember.findFirst({
                  where: {
                    committee: {
                      conferenceId,
                      abbreviation: datasetUser.committee,
                    },
                    delegation: {
                      nation: {
                        alpha3Code: datasetUser.alpha3Code,
                      },
                    },
                    userId: null,
                  },
                })
              )?.id;

              if (!committeeMemberId) {
                const delegation = await tx.delegation.findFirstOrThrow({
                  where: {
                    conference: {
                      id: conferenceId,
                    },
                    nation: {
                      alpha3Code: datasetUser.alpha3Code,
                    },
                  },
                });

                committeeMemberId = (
                  await tx.committeeMember.create({
                    data: {
                      committee: {
                        connect: {
                          abbreviation_conferenceId: {
                            abbreviation: datasetUser.committee,
                            conferenceId,
                          },
                        },
                      },
                      delegation: {
                        connect: {
                          id: delegation.id,
                        },
                      },
                    },
                  })
                ).id;
              }

              await tx.committeeMember.update({
                where: {
                  id: committeeMemberId,
                },
                data: {
                  userId,
                },
              });

              return { ...datasetUser, userId };
            }),
          );
        },
        {
          timeout: 20000,
        },
      );

      const rejected = result.filter((res) => res.status === "rejected");
      if (rejected.length > 0) {
        console.error(`Failed to process ${rejected.length} entries!`);
        console.error(JSON.stringify(rejected));
      }

      console.info(
        `Successfully processed ${body.length - rejected.length} entries!`,
      );

      return result;
    },
    {
      //TODO
      // hasConferenceRole: ["ADMIN"],
      body: t.Array(
        t.Object({
          name: t.String(),
          nation: t.String(),
          alpha3Code: t.String(),
          committee: t.String(),
          mail1: t.String({ format: "email" }),
          mail2: t.String(),
        }),
      ),
      detail: {
        description: "Import committee members",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
//   .get(
//     "/conference/:conferenceId/export",
//     async ({ params: { conferenceId } }) => {
//       const res = await db.conference.findUniqueOrThrow({
//         where: { id: conferenceId },
//         include: {
//           committees: {
//             include: {
//               members: {
//                 select: {
//                   id: true,
//                   userId: true,
//                   delegationId: true,
//                 },
//               },
//               agendaItems: true,
//             },
//           },
//           members: {
//             include: {
//               user: {
//                 include: {
//                   emails: {
//                     select: {
//                       email: true,
//                       validated: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           delegations: true,
//         },
//       });

//       Value.Clean(ConferenceExport, res);
//       return recursiveNullFieldsToUndefined(recursiveDateFieldsToString(res));
//     },
//     {
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       // hasConferenceRole: ["ADMIN"],
//       response: ConferenceExport,
//       detail: {
//         description: "Export the conference data",
//         tags: [openApiTag(import.meta.path)],
//       },
//     },
//   )

//   .post(
//     "/conference/:conferenceId/import",
//     async ({ params: { conferenceId }, body }) => {
//       //TODO this isnt optimal
//       // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//       if (!Value.Check(ConferenceImport as any, body)) {
//         // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//         return Value.Errors(ConferenceImport as any, body);
//       }

//       body.id = undefined;

//       await db.$transaction(async (tx) => {
//         return await tx.conference.update({
//           where: { id: conferenceId },
//           data: {
//             ...body,
//             committees: {
//               // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//               upsert: body.committees.map((committee: any) => ({
//                 where: {
//                   id: committee.id,
//                 },
//                 create: {
//                   ...committee,
//                   members: {
//                     // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//                     connectOrCreate: committee.members.map((member: any) => ({
//                       where: { id: member.id },
//                       create: member,
//                     })),
//                   },
//                   agendaItems: {
//                     connectOrCreate: committee.agendaItems.map(
//                       // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//                       (agendaItem: any) => ({
//                         where: { id: agendaItem.id },
//                         create: agendaItem,
//                       }),
//                     ),
//                   },
//                 },
//                 update: {
//                   ...committee,
//                   members: {
//                     // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//                     connectOrCreate: committee.members.map((member: any) => ({
//                       where: { id: member.id },
//                       create: member,
//                     })),
//                   },
//                   agendaItems: {
//                     connectOrCreate: committee.agendaItems.map(
//                       // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//                       (agendaItem: any) => ({
//                         where: { id: agendaItem.id },
//                         create: agendaItem,
//                       }),
//                     ),
//                   },
//                 },
//               })),
//             },
//             members: {
//               // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//               upsert: body.members.map((member: any) => ({
//                 where: { id: member.id },
//                 create: {
//                   role: member.role,
//                   user:
//                     member.user !== undefined
//                       ? {
//                           connectOrCreate: {
//                             where: {
//                               id: member.user.id,
//                               emails: {
//                                 some: {
//                                   OR: member.user.emails,
//                                 },
//                               },
//                             },
//                             create: {
//                               ...member.user,
//                               emails: {
//                                 create: member.user.emails,
//                               },
//                             },
//                           },
//                         }
//                       : undefined,
//                 },
//                 update: {
//                   role: member.role,
//                   user:
//                     member.user !== undefined
//                       ? {
//                           connectOrCreate: {
//                             where: {
//                               id: member.user.id,
//                               emails: {
//                                 some: {
//                                   OR: member.user.emails,
//                                 },
//                               },
//                             },
//                             create: {
//                               ...member.user,
//                               emails: {
//                                 create: member.user.emails,
//                               },
//                             },
//                           },
//                         }
//                       : undefined,
//                 },
//               })),
//             },
//             delegations: {
//               // biome-ignore lint/suspicious/noExplicitAny: we disable the built in type check by elysia since the TS compiler cant handle such a complex schema
//               upsert: body.delegations.map((delegation: any) => ({
//                 where: { id: delegation.id },
//                 create: delegation,
//                 update: delegation,
//               })),
//             },
//           },
//           include: {
//             committees: {
//               include: {
//                 members: true,
//                 agendaItems: true,
//               },
//             },
//             members: {
//               include: {
//                 user: {
//                   include: { emails: true },
//                 },
//               },
//             },
//           },
//         });

//         //TODO we cannot upsert certain entities. Everything above which is created by
//         // connectOrCreate needs to be updaten in case of a data change!
//       });
//     },
//     {
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       //TODO
//       // hasConferenceRole: ["ADMIN"],
//       body: t.Any(),
//       detail: {
//         description: "Import the conference data",
//         tags: [openApiTag(import.meta.path)],
//       },
//     },
//   );
