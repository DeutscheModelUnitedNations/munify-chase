import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { openApiTag } from "../../util/openApiTags";
import {
  sendEmailConfirmationEmail,
  sendCredentialCreationEmail,
} from "../../email/email";
import { nanoid } from "nanoid";
import { appConfiguration } from "../../util/config";
import { loggedIn } from "../../auth/guards/loggedIn";
import { User } from "../../../prisma/generated/schema";
import { passwords } from "./passwords";

const UserWithoutRelations = t.Omit(User, [
  "conferenceMemberships",
  "committeeMemberships",
  "researchServiceMessages",
  "chairMessages",
  "emails",
  "passwords",
  "pendingCredentialCreationTasks",
]);

export const auth = new Elysia({
  prefix: "/auth",
})
  .use(passwords)
  .use(loggedIn)
  .get(
    "/userState",
    async ({ query: { email } }) => {
      const foundEmail = await db.email.findUnique({
        where: {
          email,
        },
        include: { user: true },
      });

      if (!foundEmail?.user) {
        return "userNotFound";
      }

      if (!foundEmail.validated) {
        return "emailNotValidated";
      }

      return "ok";
    },
    {
      query: t.Object({
        email: t.String(),
      }),
      response: t.Union([
        t.Literal("userNotFound"),
        t.Literal("emailNotValidated"),
        t.Literal("ok"),
      ]),
      detail: {
        description:
          "Returns some info on the user in the system. Can be used to check if the user is existing and validated.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/myInfo",
    async ({ session }) => {
      const user = await db.user.findUniqueOrThrow({
        where: { id: session.userData.id },
        include: { emails: true },
      });
      return { ...user, emails: user.emails.map((e) => e.email) };
    },
    {
      mustBeLoggedIn: true,
      response: t.Composite([
        UserWithoutRelations,
        t.Object({ emails: t.Array(t.String()) }),
      ]),
      detail: {
        description: "Returns the user info when they are logged in",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/validateEmail",
    async ({ body: { email, token } }) => {
      const foundEmail = await db.email.findUnique({
        where: {
          email,
        },
        include: { validationToken: true },
      });

      if (!foundEmail) {
        return "emailNotFound";
      }

      if (foundEmail.validated) {
        return "alreadyValidated";
      }

      if (!foundEmail.validationToken) {
        return "emailDoesNotHaveActiveValidationToken";
      }

      if (new Date() > foundEmail.validationToken.expiresAt) {
        return "tokenExpired";
      }

      if (
        !(await Bun.password.verify(
          token,
          foundEmail.validationToken.tokenHash,
        ))
      ) {
        return "invalidToken";
      }

      await db.email.update({
        where: {
          email,
        },
        data: {
          validated: true,
          validationTokenId: null,
        },
      });
      await db.token.delete({
        where: { id: foundEmail.validationToken.id },
      });

      const credentialCreateToken = nanoid(32);
      await db.pendingCredentialCreateTask.create({
        data: {
          token: {
            create: {
              tokenHash: await Bun.password.hash(credentialCreateToken),
              expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
            },
          },
          user: {
            connect: {
              id: foundEmail.userId,
            },
          },
        },
      });

      return { credentialCreateToken };
    },
    {
      body: t.Object({
        email: t.String(),
        token: t.String(),
      }),
      response: t.Union([
        t.Literal("emailNotFound"),
        t.Literal("emailDoesNotHaveActiveValidationToken"),
        t.Literal("invalidToken"),
        t.Literal("alreadyValidated"),
        t.Literal("tokenExpired"),
        t.Object({ credentialCreateToken: t.String() }),
      ]),
      detail: {
        description:
          "Validates the email of a user. The token is the token that was sent to the user via email. Returns a token which can be used to create credentials",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/createUser",
    async ({ body: { email, locale, name } }) => {
      const emailValidationToken = nanoid(32);
      const emailValidationTokenHash =
        await Bun.password.hash(emailValidationToken);
      await db.user.create({
        data: {
          name: name ?? email,
          emails: {
            create: {
              email,
              validationToken: {
                create: {
                  tokenHash: emailValidationTokenHash,
                  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
              },
            },
          },
        },
      });

      //TODO: report back errors in sending emails to the frontend in structured way
      await sendEmailConfirmationEmail({
        email,
        locale,
        redirectLink: `${appConfiguration.email.EMAIL_VERIFY_REDIRECT_URL}?token=${emailValidationToken}&email=${email}`,
      });
    },
    {
      body: t.Object({
        email: t.String(),
        locale: t.Union([t.Literal("en"), t.Literal("de")]),
        name: t.Optional(t.String()),
      }),
      detail: {
        description: "Creates a user",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/sendCredentialCreateToken",
    async ({ query: { email, locale } }) => {
      const token = nanoid(32);

      const foundEmail = await db.email.findUniqueOrThrow({
        where: {
          email,
        },
      });

      await db.pendingCredentialCreateTask.create({
        data: {
          token: {
            create: {
              tokenHash: await Bun.password.hash(token),
              expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
            },
          },
          user: {
            connect: {
              id: foundEmail.userId,
            },
          },
        },
      });

      //TODO: report back errors in sending emails to the frontend in structured way
      await sendCredentialCreationEmail({
        email,
        locale,
        redirectLink: `${appConfiguration.email.CREDENTIAL_CREATE_REDIRECT_URL}?token=${token}&email=${email}`,
      });
    },
    {
      query: t.Object({
        locale: t.Union([t.Literal("en"), t.Literal("de")]),
        email: t.String(),
      }),
      detail: {
        description: "Sends a credential creation token to the users email",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
