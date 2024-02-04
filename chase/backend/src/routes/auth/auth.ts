import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { openApiTag } from "../../util/openApiTags";
import { sendAccountConfirmationEmail } from "../../email/email";
import { nanoid } from "nanoid";
import { appConfiguration } from "../../util/config";
import { passkeys } from "./passkeys";

export const auth = new Elysia({
  prefix: "/auth",
})
  .use(passkeys)
  .get(
    "/userState",
    async ({ query: { email } }) => {
      const user = await db.user.findMany({
        where: {
          email: email,
        },
      });

      if (user.length === 0) {
        return "userNotFound";
      }

      if (user.length > 1) {
        throw new Error("Multiple users with same email");
      }

      if (!user.at(0)?.emailValidated) {
        return "emailNotValidated";
      }

      if (user.at(0)?.type === "PASSKEY") {
        return "passkey";
      }

      return "password";
    },
    {
      query: t.Object({
        email: t.String(),
      }),
      response: t.Union([
        t.Literal("userNotFound"),
        t.Literal("password"),
        t.Literal("passkey"),
        t.Literal("emailNotValidated"),
      ]),
      detail: {
        description:
          "Returns some info on the user in the system. Can be used to check if the user is existing and what auth type they use.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/validateEmail",
    async ({ body: { email, token } }) => {
      const users = await db.user.findMany({
        where: {
          email: email,
        },
      });

      if (users.length === 0) {
        return "userNotFound";
      }

      if (users.length > 1) {
        throw new Error("Multiple users with same email");
      }

      // biome-ignore lint/style/noNonNullAssertion: we checked for length
      const user = users.at(0)!;

      if (!user.emailValidationTokenHash) {
        return "userDoesNotHaveActiveValidationToken";
      }

      if (!(await Bun.password.verify(token, user.emailValidationTokenHash))) {
        return "invalidToken";
      }

      await db.user.update({
        where: {
          email,
        },
        data: {
          emailValidated: true,
          emailValidationTokenHash: null,
        },
      });

      return "ok";
    },
    {
      body: t.Object({
        email: t.String(),
        token: t.String(),
      }),
      response: t.Union([
        t.Literal("userNotFound"),
        t.Literal("userDoesNotHaveActiveValidationToken"),
        t.Literal("invalidToken"),
        t.Literal("ok"),
      ]),
      detail: {
        description:
          "Validates the email of a user. The token is the token that was sent to the user via email.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/createUserWithPassword",
    async ({ body: { email, password, locale, name } }) => {
      const passwordHash = await Bun.password.hash(password);
      const emailValidationToken = nanoid(32);
      const emailValidationTokenHash =
        await Bun.password.hash(emailValidationToken);
      await db.user.create({
        data: {
          email,
          name: name ?? email,
          passwordHash,
          emailValidationTokenHash,
          // 10 minutes from now
          emailValidationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
          type: "PASSWORD",
        },
      });

      //TODO: report back errors in sending emails to the frontend in structured way
      await sendAccountConfirmationEmail({
        email,
        locale,
        redirectLink: `${appConfiguration.email.EMAIL_VERIFY_REDIRECT_URL}?token=${emailValidationToken}&email=${email}`,
      });
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        locale: t.Union([t.Literal("en"), t.Literal("de")]),
        name: t.Optional(t.String()),
      }),
      detail: {
        description:
          "Creates a user with a password.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
