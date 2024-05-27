import { type PureAbility, AbilityBuilder } from "@casl/ability";
import { createPrismaAbility, type PrismaQuery } from "./casl-prisma";
import type { db } from "../../../prisma/db";
import { defineAbilitiesForConference } from "./entities/conference";
import { defineAbilitiesForCommittee } from "./entities/committee";
import { defineAbilitiesForAgendaItem } from "./entities/agendaIems";
import { defineAbilitiesForConferenceMembers } from "./entities/conferenceMember";
import { defineAbilitiesForDelegation } from "./entities/delegation";
import { defineAbilitiesForMessages } from "./entities/messages";
import { defineAbilitiesForSpeakersList } from "./entities/speakersList";
import { defineAbilitiesForSpeakerOnList } from "./entities/speakerOnList";
import { defineAbilitiesForCommitteeMembers } from "./entities/committeeMember.ts";
import { appConfiguration } from "../../util/config";
import { defineAbilitiesForNation } from "./entities/nation";
import { defineAbilitiesForUser } from "./entities/user";
import type { IntrospectionResult } from "../oidc";

const actions = ["list", "create", "read", "update", "delete"] as const;

/**
 * Actions which can be run on entities in the system:
 *
 * - `list`: List all entities of a type
 * - `read`: Read a single entity
 * - `create`: Create a new entity
 * - `update`: Update an entity
 * - `status-update`: Update the status of an entity (non critical data, such as state of debate for committees)
 * - `delete`: Delete an entity
 */
export type Action = (typeof actions)[number];

type WithTypename<T extends object, TName extends string> = T & {
  __typename: TName;
};
type TaggedSubjects<T extends Record<string, Record<string, unknown>>> =
  | keyof T
  | { [K in keyof T]: WithTypename<T[K], K & string> }[keyof T];

export type AppAbility = PureAbility<
  [
    Action,
    TaggedSubjects<{
      AgendaItem: Awaited<
        ReturnType<(typeof db.agendaItem)["findUniqueOrThrow"]>
      >;
      Conference: Awaited<
        ReturnType<(typeof db.conference)["findUniqueOrThrow"]>
      >;
      ConferenceMember: Awaited<
        ReturnType<(typeof db.conferenceMember)["findUniqueOrThrow"]>
      >;
      Committee: Awaited<
        ReturnType<(typeof db.committee)["findUniqueOrThrow"]>
      >;
      CommitteeMember: Awaited<
        ReturnType<(typeof db.committeeMember)["findUniqueOrThrow"]>
      >;
      Delegation: Awaited<
        ReturnType<(typeof db.delegation)["findUniqueOrThrow"]>
      >;
      Message: Awaited<ReturnType<(typeof db.message)["findUniqueOrThrow"]>>;
      SpeakerOnList: Awaited<
        ReturnType<(typeof db.speakerOnList)["findUniqueOrThrow"]>
      >;
      SpeakersList: Awaited<
        ReturnType<(typeof db.speakersList)["findUniqueOrThrow"]>
      >;
      User: Awaited<
        ReturnType<(typeof db.user)["findUniqueOrThrow"]>
      >;
      Nation: Awaited<
        ReturnType<(typeof db.nation)["findUniqueOrThrow"]>
      >;
    }>,
  ],
  PrismaQuery
>;

export const defineAbilitiesForIntro = (intro: IntrospectionResult) => {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (appConfiguration.development && intro.user) {
    console.info("Development mode: granting all permissions");
    // biome-ignore lint/suspicious/noExplicitAny: https://casl.js.org/v6/en/guide/intro#basics
    builder.can("manage" as any, "all" as any);
  }

  // TODO
  if (intro.user) {
    // biome-ignore lint/suspicious/noExplicitAny: https://casl.js.org/v6/en/guide/intro#basics
    builder.can("manage" as any, "all" as any);
  }

  defineAbilitiesForConference(intro, builder);
  defineAbilitiesForCommittee(intro, builder);
  defineAbilitiesForAgendaItem(intro, builder);
  defineAbilitiesForConferenceMembers(intro, builder);
  defineAbilitiesForDelegation(intro, builder);
  defineAbilitiesForMessages(intro, builder);
  defineAbilitiesForSpeakersList(intro, builder);
  defineAbilitiesForSpeakerOnList(intro, builder);
  defineAbilitiesForNation(intro, builder);
  defineAbilitiesForUser(intro, builder);
  defineAbilitiesForCommitteeMembers(intro, builder);

  return builder.build({
    detectSubjectType: (object) => object.__typename,
  });
};
