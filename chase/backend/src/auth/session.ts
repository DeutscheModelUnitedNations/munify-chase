import Elysia, { Context, t } from "elysia";
import { nanoid } from "nanoid";
import { createClient } from "redis";
import { appConfiguration } from "../config/config";

const client = createClient({
  url: appConfiguration.db.redisUrl,
});
client.on("error", (err) => console.error("Redis Client Error", err));
await client.connect();

export type SessionData = {
  userData?: {
    userId: string;
    email: string;
    family_name: string;
    given_name: string;
  };
};

export const session = new Elysia()
  .guard({
    cookie: t.Cookie({
      sessionId: t.Optional(t.String()),
    }),
  })
  .derive(async ({ cookie: { sessionId } }) => {
    const createNewSession = async () => {
      sessionId.value = nanoid(30);

      const data: SessionData = {};
      await client.set(`user-session:${sessionId.value}`, JSON.stringify(data));

      return {
        session: { id: sessionId.value, data: data },
      };
    };

    if (!sessionId.value) {
      return createNewSession();
    }

    const rawData = await client.get(`user-session:${sessionId.value}`);
    if (!rawData) {
      return createNewSession();
    }
    const data: SessionData = JSON.parse(rawData);

    return {
      session: { id: sessionId.value, data },
    };
  });

export const loggedIn = new Elysia().use(session).guard({
  beforeHandle({ session, set }) {
    if (!session.data.userData) {
      // biome-ignore lint/suspicious/noAssignInExpressions: just return the state as body aswell
      return (set.status = "Unauthorized");
    }
  },
});
