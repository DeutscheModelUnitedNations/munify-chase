import { TSchema, t } from "elysia";
import {
  CommitteeMemberExport,
  CommitteeExport,
  AgendaItemExport,
  EmailExport,
  UserExport,
  ConferenceMemberExport,
  DelegationExport,
  ConferenceExport,
} from "./exportSchema";

function makeIdOptional<T extends TSchema>(schema: T) {
  return t.Composite([
    t.Omit(schema, ["id"]),
    t.Partial(t.Pick(schema, ["id"])),
  ]);
}

export const CommitteeMemberImport = makeIdOptional(CommitteeMemberExport);
export const AgendaItemImport = makeIdOptional(AgendaItemExport);

export const CommitteeImport = t.Composite([
  makeIdOptional(CommitteeExport),
  t.Object({
    members: t.Array(CommitteeMemberImport),
    agendaItems: t.Array(AgendaItemImport),
  }),
]);

export const EmailImport = makeIdOptional(EmailExport);

export const UserImport = t.Composite([
  makeIdOptional(UserExport),
  t.Object({
    emails: t.Array(EmailImport),
  }),
]);

export const ConferenceMemberImport = t.Composite([
  makeIdOptional(ConferenceMemberExport),
  t.Object({
    user: t.Optional(UserImport),
  }),
]);

export const DelegationImport = makeIdOptional(DelegationExport);

export const ConferenceImport = t.Composite([
  makeIdOptional(ConferenceExport),
  t.Object({
    committees: t.Array(CommitteeImport),
    members: t.Array(ConferenceMemberImport),
    delegations: t.Array(DelegationImport),
  }),
]);
