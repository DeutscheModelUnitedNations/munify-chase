import { type PureAbility, AbilityBuilder } from "@casl/ability";
import { createPrismaAbility, type PrismaQuery } from "./casl-prisma";
import type { Session } from "../session";
import type { db } from "../../../prisma/db";

export type Action = "list" | "read" | "create" | "update" | "delete";

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
      Conference: Awaited<
        ReturnType<(typeof db.conference)["findUniqueOrThrow"]>
      >;
      Committee: Awaited<
        ReturnType<(typeof db.committee)["findUniqueOrThrow"]>
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
        members: { some: { user: {id: user.id}, role: "ADMIN" } },
      });
    }
  }

  return build({
    detectSubjectType: (object) => object.__typename,
  });
};
