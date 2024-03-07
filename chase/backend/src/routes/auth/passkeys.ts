// import { t, Elysia } from "elysia";
// import {
//   generateAuthenticationOptions,
//   generateRegistrationOptions,
//   verifyRegistrationResponse,
// } from "@simplewebauthn/server";
// import { appConfiguration } from "../../util/config";
// import { db } from "../../../prisma/db";
// import { openApiTag } from "../../util/openApiTags";
// import { session } from "../../auth/session";
// import { nanoid } from "nanoid";
// import { sendEmailConfirmationEmail } from "../../email/email";

// export const passkeys = new Elysia();
// .use(session)
// .post(
//   "/createUserWithPasskey",
//   async ({ body: { email }, session }) => {
//     const userID = nanoid();

//     const options = await generateRegistrationOptions({
//       rpName: appConfiguration.passkeys.RELAY_NAME,
//       rpID: appConfiguration.passkeys.RELAY_ID,
//       userID,
//       userName: email,
//       // Don't prompt users for additional information about the authenticator
//       // (Recommended for smoother UX)
//       attestationType: 'none',
//       // See "Guiding use of authenticators via authenticatorSelection" below
//       authenticatorSelection: {
//         residentKey: 'preferred',
//         userVerification: 'preferred',
//         requireResidentKey: false,
//         authenticatorAttachment: 'cross-platform',
//       },
//     });

//     await session.setPasskeyChallenge({
//       challenge: options.challenge,
//       email,
//       userID: userID,
//     });

//     return options;
//   },
//   {
//     body: t.Object({
//       email: t.String({ format: "email" }),
//     }),
//     detail: {
//       description: "Starts the process of user creation with a passkey",
//       tags: [openApiTag(import.meta.path)],
//     },
//   },
// )
// .post(
//   "/finishPasskeyRegistration",
//   async ({ session, body: { challenge, locale, name } }) => {
//     if (!session.currentPasskeyChallenge) {
//       throw new Error("No challenge present for that session");
//     }

//     const verification = await verifyRegistrationResponse({
//       response: challenge,
//       expectedChallenge: session.currentPasskeyChallenge.challenge,
//       expectedOrigin: appConfiguration.passkeys.RELAY_ORIGIN,
//       expectedRPID: appConfiguration.passkeys.RELAY_ID,
//     });

//     if (!verification.verified) {
//       throw new Error(`Verification status: ${verification.verified}`);
//     }

//     if (!verification.registrationInfo) {
//       throw new Error("Registration info not set in verification");
//     }

//     await session.setPasskeyChallenge(undefined);

//     const emailValidationToken = nanoid(32);
//     const emailValidationTokenHash =
//       await Bun.password.hash(emailValidationToken);

//     await db.user.create({
//       data: {
//         email: session.currentPasskeyChallenge.email,
//         name: name ?? session.currentPasskeyChallenge.email,
//         type: "PASSKEY",
//         emailValidationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
//         emailValidationTokenHash,

//         passkeyCredentialID: new TextDecoder().decode(
//           verification.registrationInfo.credentialID,
//         ),
//         passkeyCredentialPublicKey: new TextDecoder().decode(
//           verification.registrationInfo.credentialPublicKey,
//         ),
//         passkeyCredentialCounter: verification.registrationInfo.counter,
//         passkeyCredentialDeviceType:
//           verification.registrationInfo.credentialDeviceType,
//         passkeyCredentialBackedUp:
//           verification.registrationInfo.credentialBackedUp,
//       },
//     });

//     //TODO: report back errors in sending emails to the frontend in structured way
//     await sendAccountConfirmationEmail({
//       email: session.currentPasskeyChallenge.email,
//       locale,
//       redirectLink: `${appConfiguration.email.EMAIL_VERIFY_REDIRECT_URL}?token=${emailValidationToken}&email=${session.currentPasskeyChallenge.email}`,
//     });
//   },
//   {
//     body: t.Object({
//       challenge: t.Any(),
//       locale: t.Union([t.Literal("en"), t.Literal("de")]),
//       name: t.Optional(t.String()),
//     }),
//     detail: {
//       description: "Finalizes passkey setup.",
//       tags: [openApiTag(import.meta.path)],
//     },
//   },
// )
// .post(
//   "/startLoginWithPasskey",
//   async ({ body: { email }, session }) => {
//     const user = await db.user.findUniqueOrThrow({
//       where: {
//         email,
//       },
//     });

//     if (!user.emailValidated) {
//       throw new Error("Email not validated");
//     }

//     if (
//       user.type !== "PASSKEY" ||
//       !user.passkeyCredentialBackedUp ||
//       !user.passkeyCredentialID ||
//       !user.passkeyCredentialPublicKey
//     ) {
//       throw new Error("User is not a passkey user");
//     }

//     const options = await generateAuthenticationOptions({
//       rpID: appConfiguration.passkeys.RELAY_ID,
//       // Require users to use a previously-registered authenticator
//       allowCredentials: [
//         {
//           id: user.passkeyCredentialID,
//           type: "public-key",
//           // transports: authenticator.transports,
//         },
//       ],
//       userVerification: "preferred",
//     });
//   },
//   {
//     body: t.Object({
//       email: t.String({ format: "email" }),
//     }),
//     detail: {
//       description: "Login with a passkey",
//       tags: [openApiTag(import.meta.path)],
//     },
//   },
// );
