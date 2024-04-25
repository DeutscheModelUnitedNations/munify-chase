import { type PureAbility, AbilityBuilder } from "@casl/ability";
import { createPrismaAbility, type PrismaQuery } from "./casl-prisma";
import type { Session } from "../session";
import type { db } from "../../../prisma/db";

const actions = ["list", "read", "create", "update", "status-update", "delete"] as const;

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
export type Action = typeof actions[number];

type WithTypename<T extends object, TName extends string> = T & {
  __typename: TName;
};
type TaggedSubjects<T extends Record<string, Record<string, unknown>>> =
  | keyof T
  | { [K in keyof T]: WithTypename<T[K], K & string> }[keyof T];

type AppAbility = PureAbility<
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
      Delegation: Awaited<
      ReturnType<(typeof db.delegation)["findUniqueOrThrow"]>
    >;
    }>,
  ],
  PrismaQuery
>;

export const defineAbilitiesForSession = (session: Session) => {
  const {
    can,
    // cannot
    build,
  } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (session.data?.loggedIn) {
    can("list", "Conference");
    can("create", "Conference"); // also requires creation token
    if (session.data.user) {
      const user = session.data.user;
      can("read", "Conference", {
        OR: [
          { members: { some: { user: { id: user.id } } } },
          {
            committees: {
              some: { members: { some: { user: { id: user.id } } } },
            },
          },
        ],
      });
      can(["update", "delete"], "Conference", {
        members: { some: { user: { id: user.id }, role: "ADMIN" } },
      });
    }
  }

  return build({
    detectSubjectType: (object) => object.__typename,
  });
};
