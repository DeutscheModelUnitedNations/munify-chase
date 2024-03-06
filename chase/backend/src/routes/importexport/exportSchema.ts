import { t } from "elysia";
import {
  AgendaItem,
  Committee,
  CommitteeMember,
  Conference,
  ConferenceMember,
  Delegation,
  Email,
  User,
} from "../../../prisma/generated/schema";

export const CommitteeMemberExport = t.Omit(CommitteeMember, [
  "committee",
  "committeeId",
  "user",
  "speakerLists",
  "delegation",
  "presence",
]);

export const AgendaItemExport = t.Omit(AgendaItem, [
  "committee",
  "committeeId",
  "speakerLists",
]);

export const CommitteeExport = t.Composite([
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
    members: t.Array(CommitteeMemberExport),
    agendaItems: t.Array(AgendaItemExport),
  }),
]);

export const EmailExport = t.Omit(Email, [
  "user",
  "userId",
  "validationToken",
  "validationTokenId",
]);

export const UserExport = t.Composite([
  t.Omit(User, [
    "conferenceMemberships",
    "committeeMemberships",
    "messages",
    "emails",
    "passwords",
    "pendingCredentialCreationTasks",
  ]),
  t.Object({
    emails: t.Array(EmailExport),
  }),
]);

export const ConferenceMemberExport = t.Composite([
  t.Omit(ConferenceMember, [
    "conference",
    "conferenceId",
    "user",
    "nonStateActor",
  ]),
  t.Object({
    user: t.Optional(UserExport),
  }),
]);

export const DelegationExport = t.Omit(Delegation, [
  "conference",
  "conferenceId",
  "nation",
  "members",
]);

export const ConferenceExport = t.Composite([
  t.Omit(Conference, [
    "committees",
    "delegations",
    "members",
    "researchServiceMessagees",
  ]),
  t.Object({
    committees: t.Array(CommitteeExport),
    members: t.Array(ConferenceMemberExport),
    delegations: t.Array(DelegationExport),
  }),
]);
