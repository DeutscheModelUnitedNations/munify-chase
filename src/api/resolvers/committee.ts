import {
  CommitteeAbbreviationFieldObject,
  CommitteeAllowDelegationsToAddThemselvesToSpeakersListFieldObject,
  CommitteeCategoryFieldObject,
  CommitteeIdFieldObject,
  CommitteeNameFieldObject,
  CommitteeStateOfDebateFieldObject,
  CommitteeStatusFieldObject,
  CommitteeStatusHeadlineFieldObject,
  CommitteeStatusUntilFieldObject,
  CommitteeWhiteboardContentFieldObject,
} from "chase-backend/prisma/generated/graphql/Committee";
import { builder } from "./builder";

builder.prismaObject("Committee", {
  fields: (t) => ({
    id: t.field(CommitteeIdFieldObject),
    name: t.field(CommitteeNameFieldObject),
    abbreviation: t.field(CommitteeAbbreviationFieldObject),
    category: t.field(CommitteeCategoryFieldObject),
    whiteboardContent: t.field(CommitteeWhiteboardContentFieldObject),
    status: t.field(CommitteeStatusFieldObject),
    stateOfDebate: t.field(CommitteeStateOfDebateFieldObject),
    statusHeadline: t.field(CommitteeStatusHeadlineFieldObject),
    statusUntil: t.field(CommitteeStatusUntilFieldObject),
    allowDelegationsToAddThemselvesToSpeakersList: t.field(
      CommitteeAllowDelegationsToAddThemselvesToSpeakersListFieldObject,
    ),
    conference: t.relation("conference"),
    members: t.relation("members", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").CommitteeMember,
      }),
    }),
    parent: t.relation("parent", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("read").Committee,
      }),
    }),
    subCommittees: t.relation("subCommittees", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Committee,
      }),
    }),
    messages: t.relation("messages", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").Message,
      }),
    }),
    agendaItems: t.relation("agendaItems", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").AgendaItem,
      }),
    }),
  }),
});
