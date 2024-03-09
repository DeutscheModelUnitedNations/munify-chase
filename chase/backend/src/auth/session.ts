import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { redis } from "../../prisma/db";
import { appConfiguration } from "../util/config";
// import { generateKeyPairSync, createSign, createVerify } from "crypto";

// const { publicKey, privateKey } = generateKeyPairSync("rsa", {
//   modulusLength: 2048,
// });

//TODO periodically purge old sessions

//TODO periodically purge old sessions

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
      chaseCookieConsent: t.Optional(t.Boolean()),
    }),
  })
  .derive(async ({ cookie: { sessionId: sessionIdCookie } }) => {
    //TODO refactor
    // if (chaseCookieConsent.value !== true) {
    //   set.status = "Unavailable For Legal Reasons";
    //   throw new Error(
    //     "User has not consented to cookies. Please ensure the 'chaseCookieConsent' cookie is set to true!",
    //   );
    // }

    sessionIdCookie.httpOnly = true;
    sessionIdCookie.maxAge = 60 * 60 * 24 * 7; // 7 days
    sessionIdCookie.sameSite = appConfiguration.development ? "none" : "strict";
    sessionIdCookie.secure = true;
    sessionIdCookie.path = "/";

    let sessionId = sessionIdCookie.value;
    // let sessionId = sessionIdCookie.value?.split(".")[0];
    // let sessionIdSignature = sessionIdCookie.value?.split(".")[1];
    // if (sessionId) {
    //   const verify = createVerify("SHA256");
    //   verify.update(sessionId);
    //   if (
    //     !sessionIdSignature ||
    //     !verify.verify(publicKey, sessionIdSignature, "hex")
    //   ) {
    //     // if the session signature is not valid, treat the user as if they have no session id cookie set
    //     sessionId = undefined;
    //     sessionIdSignature = undefined;
    //   }
    // }

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
      await redis.set(`user-session:${sessionId}`, JSON.stringify(data), {
        EX: 1000 * 60 * 60 * 24 * 7, // a week
      });
    };

    const setLoggedIn = async (loggedIn: boolean) => {
      data.loggedIn = loggedIn;
      if (!data.loggedIn) {
        await redis.del(`user-session:${sessionId}`);
        sessionIdCookie.remove();
      } else {
        await redis.set(`user-session:${sessionId}`, JSON.stringify(data), {
          EX: 1000 * 60 * 60 * 24 * 7, // a week
        });
      }
    };

    const createNewSessionInDB = async () => {
      sessionId = nanoid();
      // const sign = createSign("SHA256");
      // sign.update(sessionId);
      // const signature = sign.sign(privateKey, "hex");
      // sessionIdCookie.value = `${sessionId}.${signature}`; // sets the session id in the cookie
      sessionIdCookie.value = sessionId; // sets the session id in the cookie
      await redis.set(`user-session:${sessionId}`, JSON.stringify(data), {
        EX: 1000 * 60 * 60 * 24 * 7, // a week
      });

      return {
        // session: { ...data, setPasskeyChallenge, setUserData, setLoggedIn },
        session: { ...data, setUserData, setLoggedIn },
      };
    };

    // no session id given by user? create a new session
    if (!sessionId) {
      return createNewSessionInDB();
    }

    // if the user provides a session id, check if it exists in the db
    const rawData = await redis.get(`user-session:${sessionId}`);
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
  