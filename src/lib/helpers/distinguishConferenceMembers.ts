import type { schema } from "$api/db/db";

type Member =
  | typeof schema.conferenceMember.$inferSelect
  | typeof schema.committeeMember.$inferSelect;
type Representation = typeof schema.representation.$inferSelect;
type DefaultRepresentation = Pick<
  Representation,
  "id" | "createdAt" | "updatedAt" | "type"
>;
type NSARepresentation = Pick<
  Representation,
  "faIcon" | "name" | "conferenceId"
> & {
  type: (typeof schema.representationType.enumValues)[1];
} & DefaultRepresentation;
type DelegationRepresentation = Pick<
  Representation,
  "faIcon" | "name" | "conferenceId"
> & {
  type: (typeof schema.representationType.enumValues)[2];
} & DefaultRepresentation;
type UNRepresentation = Pick<
  Representation,
  "alpha2Code" | "alpha3Code" | "regionalGroup"
> & {
  type: (typeof schema.representationType.enumValues)[0];
} & DefaultRepresentation;

export function isNSAMember<
  T extends Partial<Member> & { representation: Partial<Representation> },
>(input: T): input is T & { representation: NSARepresentation } {
  return input.representation.type === "NSA";
}

export function isDelegationMember<
  T extends Partial<Member> & { representation: Partial<Representation> },
>(input: T): input is T & { representation: DelegationRepresentation } {
  return input.representation.type === "DELEGATION";
}

export function isUNMember<
  T extends Partial<Member> & { representation: Partial<Representation> },
>(input: T): input is T & { representation: UNRepresentation } {
  return input.representation.type === "UN";
}
