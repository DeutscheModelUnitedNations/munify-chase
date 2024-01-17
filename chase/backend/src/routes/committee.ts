import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";

export const committee = new Elysia({
  prefix: "/conference/:conferenceId/committee",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
