import { type PureAbility, AbilityBuilder } from "@casl/ability";
import type { Subjects } from "@casl/prisma";
import { createPrismaAbility, type PrismaQuery } from "./casl-prisma";
import type { Session } from "../session";
import type { db } from "../../../prisma/db";

export type Action = "list" | "read" | "create" | "update" | "delete";

type AppAbility = PureAbility<
  [
    Action,
    Subjects<{
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
    build,
    // cannot
  } = new AbilityBuilder<AppAbility>(createPrismaAbility);

  if (session.data?.loggedIn) {
    can("list", "Conference");
    can("create", "Conference"); // also requires creation token
    if (session.data.user) {
      const user = session.data.user;
      can("read", "Conference", {
        OR: [
          { members: { some: { id: user.id } } },
          {
            committees: {
              some: { members: { some: { id: user.id } } },
            },
          },
        ],
      });
      can(["update", "delete"], "Conference", {
        members: { some: { id: user.id, role: "ADMIN" } },
      });
    }
  }

  return build({
    detectSubjectType: (object) => object.$kind,
  });
};
