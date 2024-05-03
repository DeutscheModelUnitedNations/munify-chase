import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { redis } from "../../prisma/db";
import { appConfiguration } from "../util/config";
import type { Email, User } from "../../prisma/generated/client";

//TODO periodically purge old sessions? Or does redis do that for us?

const expirationDurationInSeconds = 60 * 60 * 24 * 7; // a week

export type SessionData = {
  loggedIn: boolean;
  /**
   * The user data is stored in the session. This is the user data. May be undefined in case the user is not logged in.
   * CAREFUL: Existing data does not mean the user has a valid session. Check the loggedIn property for that.
   */
  user?: Pick<User, "id" | "name"> & Pick<Email, "email">;
};

export type SessionDataSetter = (data: Partial<SessionData>) => Promise<void>;

export type Session = {
  /**
   * In case the user has not given consent to set cookies, the data cannot be stored and will be undefined
   */
  data?: SessionData;
  setData: SessionDataSetter;
};

export const sessionPlugin = new Elysia({ name: "session" })
  .guard({
    cookie: t.Cookie(
      {
        sessionId: t.Optional(t.String()),
        chaseCookieConsent: t.Optional(t.Boolean()),
      },
      {
        secrets: appConfiguration.cookie.secrets,
        sign: ["sessionId"],
        httpOnly: true,
        maxAge: expirationDurationInSeconds,
        sameSite: appConfiguration.development ? "none" : "strict",
        secure: true,
        path: "/",
      },
    ),
  })
  .derive(
    { as: "scoped" },
    async ({
      cookie: { sessionId, chaseCookieConsent },
      set,
    }): Promise<{ session: Session }> => {
      const session: Session = {
        data: undefined,
        setData: () => {
          set.status = "Unavailable For Legal Reasons";
          throw new Error("You need to accept cookies to use this feature.");
        },
      };
      if (chaseCookieConsent.value !== true) {
        return { session };
      }

      const data: SessionData = {
        loggedIn: false,
        user: undefined,
      };
      session.data = data;

      const sessionIdValue = sessionId.value ?? nanoid();
      const redisIdentifier = `user-session:${sessionIdValue}`;
      const setData: SessionDataSetter = async (newData) => {
        if (newData?.loggedIn !== undefined) {
          data.loggedIn = newData.loggedIn;
          if (newData.loggedIn === false) {
            sessionId.remove();
            await redis.del(redisIdentifier);
          }
        }
        if (newData?.user !== undefined) {
          data.user = newData.user;
        }
        await redis.set(redisIdentifier, JSON.stringify(data), {
          EX: expirationDurationInSeconds,
        });
        sessionId.value = sessionIdValue;
        sessionId.httpOnly = true;
        sessionId.maxAge = expirationDurationInSeconds;
        sessionId.sameSite = appConfiguration.development ? "none" : "strict";
        sessionId.secure = true;
        sessionId.path = "/";
        sessionId.secrets = appConfiguration.cookie.secrets;
      };
      session.setData = setData;

      const rawRedisSessionData = sessionId
        ? await redis.get(redisIdentifier)
        : null;

      if (rawRedisSessionData) {
        Object.assign(data, JSON.parse(rawRedisSessionData));
      }

      setData({}); // refresh timeout for the redis entry

      return { session };
    },
  );
