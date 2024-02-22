import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { redis } from "../../prisma/db";

interface UserData {
  id: string;
}

// interface PassKeyChallenge {
//   userID: string;
//   email: string;
//   // biome-ignore lint/suspicious/noExplicitAny:
//   challenge: any;
// }

type sessionSchema = {
  loggedIn: boolean;
  userData?: UserData;
  // currentPasskeyChallenge?: PassKeyChallenge;
};

export const session = new Elysia({ name: "session" })
  .guard({
    cookie: t.Cookie({
      sessionId: t.Optional(t.String()),
    }),
  })
  .derive(async ({ cookie: { sessionId } }) => {
    let data: sessionSchema = { loggedIn: false };

    // TODO: setter could be actual getters and setters
    // const setPasskeyChallenge = async (
    //   challenge: PassKeyChallenge | undefined,
    // ) => {
    //   data.currentPasskeyChallenge = challenge;
    //   await redis.set(`user-session:${sessionId.value}`, JSON.stringify(data));
    // };

    const setUserData = async (userData: UserData) => {
      data.userData = userData;
      await redis.set(`user-session:${sessionId.value}`, JSON.stringify(data));
    };

    const setLoggedIn = async (loggedIn: boolean) => {
      data.loggedIn = loggedIn;
      await redis.set(`user-session:${sessionId.value}`, JSON.stringify(data));
    };

    const createNewSessionInDB = async () => {
      sessionId.value = nanoid(30); // sets the session id in the cookie

      await redis.set(`user-session:${sessionId.value}`, JSON.stringify(data));

      return {
        // session: { ...data, setPasskeyChallenge, setUserData, setLoggedIn },
        session: { ...data, setUserData, setLoggedIn },
      };
    };

    // no session id given by user? create a new session
    if (!sessionId.value) {
      return createNewSessionInDB();
    }

    // if the user provides a session id, check if it exists in the db
    const rawData = await redis.get(`user-session:${sessionId.value}`);
    // if the session id doesn't exist in the db, create a new session
    if (!rawData) {
      return createNewSessionInDB();
    }
    data = JSON.parse(rawData);

    return {
      // session: { ...data, setPasskeyChallenge, setUserData, setLoggedIn },
      session: { ...data, setUserData, setLoggedIn },
    };
  });
