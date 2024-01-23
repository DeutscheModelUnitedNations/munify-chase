import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import { User } from "../../prisma/generated/schema";
import { sendAccountConfirmationEmail } from "../email/email";
import { nanoid } from "nanoid";
import { appConfiguration } from "../util/config";

const UserWithoutRelations = t.Omit(User, [
  "conferenceMemberships",
  "committeeMemberships",
]);

const UserData = t.Omit(UserWithoutRelations, ["id"]);

export const auth = new Elysia({
  prefix: "/auth",
})
  .get(
    "/userState",
    async ({ query: { email } }) => {
      const user = await db.user.findMany({
        where: {
          email: email,
        },
      });

      if (user.length === 0) {
        return "notFound";
      }

      if (user.length > 0) {
        throw new Error("Multiple users with same email");
      }

      if (!user.at(0)?.emailValidated) {
        return "emailNotValidated";
      }

      if (user.at(0)?.passkeyPubKey) {
        return "passkey";
      }

      return "password";
    },
    {
      query: t.Object({
        email: t.String(),
      }),
      response: t.Union([
        t.Literal("notFound"),
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
  .get("/validateEmail", async () => {}) //TODO
  .post(
    "/createUserWithPassword",
    async ({ body: { email, password, locale } }) => {
      const passwordHash = await Bun.password.hash(password);
      const emailValidationToken = nanoid(32);
      const emailValidationTokenHash =
        await Bun.password.hash(emailValidationToken);
      // await db.user.create({
      //   data: {
      //     email,
      //     name: email,
      //     passwordHash,
      //     emailValidationTokenHash, //TODO we should probably add a timeout
      //   },
      // });
      await sendAccountConfirmationEmail({
        email,
        locale,
        redirectLink: `${appConfiguration.email.EMAIL_VERIFY_REDIRECT_URL}?token=${emailValidationToken}`,
      });
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        locale: t.Union([t.Literal("en"), t.Literal("de")]),
      }),
      detail: {
        description:
          "Creates a user with a password. The user will be created with the email as name.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
