import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { loggedIn } from "../auth/guards/loggedIn";
import {
  Nation,
  NonStateActor,
  SpecialPerson,
} from "../../prisma/generated/schema";
import { openApiTag } from "../util/openApiTags";

export const baseData = new Elysia({ prefix: "/baseData" })
  .use(loggedIn)
  .get(
    "/countries",
    () => db.nation.findMany({ select: { id: true, alpha3Code: true } }),
    {
      mustBeLoggedIn: true,
      response: t.Array(t.Omit(Nation, ["delegations"])),
      detail: {
        description: "Get all nations in the system",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/nonStateActors",
    () =>
      db.nonStateActor.findMany({
        select: { id: true, code: true },
      }),
    {
      mustBeLoggedIn: true,
      response: t.Array(NonStateActor),
      detail: {
        description: "Get all non state actors in the system",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/specialPersons",
    () =>
      db.specialPerson.findMany({
        select: { id: true, code: true },
      }),
    {
      mustBeLoggedIn: true,
      response: t.Array(SpecialPerson),
      detail: {
        description: "Get all special persons in the system",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
