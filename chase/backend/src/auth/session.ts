import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { redis } from "../../prisma/db";

type sessionSchema = {
  userData?: {
    id: string;
    email: string;
    family_name: string;
    given_name: string;
  };
};

export const session = new Elysia({ name: "session" })
  .guard({
    cookie: t.Cookie({
      sessionId: t.Optional(t.String()),
    }),
  })
  .derive(async ({ cookie: { sessionId } }) => {
    const createNewSession = async () => {
      sessionId.value = nanoid(30);

      const data: sessionSchema = {};
      await redis.set(`user-session:${sessionId.value}`, JSON.stringify(data));

      return {
        session: { ...data },
      };
    };

    if (!sessionId.value) {
      return createNewSession();
    }

    const rawData = await redis.get(`user-session:${sessionId.value}`);
    if (!rawData) {
      return createNewSession();
    }
    const data: sessionSchema = JSON.parse(rawData);

    return {
      session: { ...data },
    };
  });
