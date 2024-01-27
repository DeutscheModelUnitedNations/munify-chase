import { t, Elysia } from "elysia";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { appConfiguration } from "../../util/config";
import { db } from "../../../prisma/db";
import { openApiTag } from "../../util/openApiTags";
import { session } from "../../auth/session";
import { nanoid } from "nanoid";
import { sendAccountConfirmationEmail } from "../../email/email";

export const passkeys = new Elysia()
  .use(session)
  .post(
    "/createUserWithPasskey",
    async ({ body: { email, locale, name }, session }) => {
      return db.$transaction(async (tx) => {
        const emailValidationToken = nanoid(32);
        const emailValidationTokenHash =
          await Bun.password.hash(emailValidationToken);
        const user = await tx.user.create({
          data: {
            email,
            name: name ?? email,
            type: "PASSKEY",
            emailValidationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
            emailValidationTokenHash,
          },
        });

        await session.setUserData({
          id: user.id,
          email: user.email,
        });

        //TODO: report back errors in sending emails to the frontend in structured way
        await sendAccountConfirmationEmail({
          email,
          locale,
          redirectLink: `${appConfiguration.email.EMAIL_VERIFY_REDIRECT_URL}?token=${emailValidationToken}&email=${email}`,
        });

        const options = await generateRegistrationOptions({
          rpName: appConfiguration.passkeys.RELAY_NAME,
          rpID: appConfiguration.passkeys.RELAY_ID,
          userID: user.id,
          userName: user.email,
          // Don't prompt users for additional information about the authenticator
          // (Recommended for smoother UX)
          attestationType: "none",
          // Prevent users from re-registering existing authenticators
          excludeCredentials: [],
          // See "Guiding use of authenticators via authenticatorSelection" below
          authenticatorSelection: {
            // Defaults
            residentKey: "preferred",
            userVerification: "preferred",
            // Optional
            authenticatorAttachment: "cross-platform",
          },
        });

        await session.setPasskeyChallenge(options.challenge);

        return options;
      });
    },
    {
      body: t.Object({
        email: t.String(),
        locale: t.Union([t.Literal("en"), t.Literal("de")]),
        name: t.Optional(t.String()),
      }),
      detail: {
        description: "Creates a user with a passkey",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/finishPasskeyRegistration",
    async ({ session, body }) => {
      const verification = await verifyRegistrationResponse({
        // biome-ignore lint/suspicious/noExplicitAny: we expect the user to pass the correct object here, the validation will fail anyway if the schema is incorrect
        response: body as any,
        expectedChallenge: session.currentPasskeyChallenge,
        expectedOrigin: appConfiguration.passkeys.RELAY_ORIGIN,
        expectedRPID: appConfiguration.passkeys.RELAY_ID,
      });

      if (!verification.verified) {
        throw new Error(`Verification status: ${verification.verified}`);
      }

      if (!verification.registrationInfo) {
        throw new Error("Registration info not set in verification");
      }

      if (!session.userData) {
        throw new Error("User data not set in session");
      }

      await session.setPasskeyChallenge(undefined);

      await db.user.update({
        where: {
          id: session.userData.id,
        },
        data: {
          passkeyCredentialID: new TextDecoder().decode(
            verification.registrationInfo.credentialID,
          ),
          passkeyCredentialPublicKey: new TextDecoder().decode(
            verification.registrationInfo.credentialPublicKey,
          ),
          passkeyCredentialCounter: verification.registrationInfo.counter,
          passkeyCredentialDeviceType:
            verification.registrationInfo.credentialDeviceType,
          passkeyCredentialBackedUp:
            verification.registrationInfo.credentialBackedUp,
        },
      });
    },
    {
      body: t.Any(),
      detail: {
        description: "Finalizes passkey setup.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
