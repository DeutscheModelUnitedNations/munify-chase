import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { openApiTag } from "../../util/openApiTags";
import { loggedIn } from "../../auth/guards/loggedIn";

const passwordRegex =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;

export const passwords = new Elysia()
  .use(loggedIn)
  .post(
    "/password",
    async ({ body: { email, password, credentialCreateToken } }) => {
      const foundEmail = await db.email.findUniqueOrThrow({
        where: {
          email,
        },
        include: {
          user: {
            include: {
              passwords: true,
              pendingCredentialCreationTasks: { include: { token: true } },
            },
          },
        },
      });

      if (!foundEmail.validated) {
        throw new Error("Email not validated");
      }

      if (!passwordRegex.test(password)) {
        throw new Error("Password does not meet requirements");
      }

      const foundTask = foundEmail.user.pendingCredentialCreationTasks.find(
        (task) =>
          Bun.password.verify(credentialCreateToken, task.token.tokenHash),
      );

      if (!foundTask) {
        throw new Error("Invalid token");
      }

      if (
        foundEmail.user.passwords.some((p) =>
          Bun.password.verify(password, p.passwordHash),
        )
      ) {
        throw new Error("Password already exists");
      }

      await db.password.create({
        data: {
          passwordHash: await Bun.password.hash(password),
          user: {
            connect: {
              id: foundEmail.userId,
            },
          },
        },
      });

      await db.pendingCredentialCreateTask.delete({
        where: {
          id: foundTask.id,
        },
      });

      await db.token.delete({
        where: {
          id: foundTask.token.id,
        },
      });
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        credentialCreateToken: t.String(),
      }),
      detail: {
        description: "Login with a password",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/password",
    async ({ body: { email, password } }) => {
      const foundEmail = await db.email.findUniqueOrThrow({
        where: {
          email,
        },
        include: {
          user: {
            include: {
              passwords: true,
            },
          },
        },
      });

      const foundPassword = foundEmail.user.passwords.find((p) =>
        Bun.password.verify(password, p.passwordHash),
      );

      if (!foundPassword) {
        throw new Error("Password not found");
      }

      await db.password.delete({
        where: {
          id: foundPassword.id,
        },
      });
    },
    {
      mustBeLoggedIn: true,
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      detail: {
        description: "Delete a password",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/password/login",
    async ({ body: { email, password }, session }) => {
      const foundEmail = await db.email.findUniqueOrThrow({
        where: {
          email,
        },
        include: { user: { include: { passwords: true } } },
      });

      if (!foundEmail.validated) {
        throw new Error("Email not validated");
      }
      if (
        !foundEmail.user.passwords
          .map((p) => Bun.password.verify(password, p.passwordHash))
          .some((p) => p)
      ) {
        throw new Error("Invalid password");
      }

      session.setLoggedIn(true);
      session.setUserData({
        id: foundEmail.user.id,
      });
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      detail: {
        description: "Login with a password",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
