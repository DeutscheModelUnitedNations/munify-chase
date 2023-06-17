// import { NowRequestHandler } from "fastify-now";
// import { Static, Type } from "@sinclair/typebox";
// import { db } from "../../../prisma/client";

// const Body = Type.Object({
//   email: Type.String({ format: "email" }),
//   token: Type.String(),
// });
// type BodyType = Static<typeof Body>;

// const Reply = Type.Literal(
//   "Your email has been confirmed and you are now logged in"
// );
// type ReplyType = Static<typeof Reply>;

// const ErrorReply = Type.Union([
//   Type.Literal("CouldNotFindUser"),
//   Type.Literal("InvalidToken"),
// ]);
// type ErrorReplyType = Static<typeof ErrorReply>;

// export const POST: NowRequestHandler<{
//   Body: BodyType;
//   Reply: ReplyType | ErrorReplyType;
// }> = async (req, rep) => {
//   const pendingEmailVerification = await db.pendingEmailVerification.findFirst({
//     where: {
//       User: {
//         email: req.body.email,
//       },
//     },
//   });

//   if (!pendingEmailVerification) {
//     rep.status(401);
//     return "CouldNotFindUser";
//   }

//   if (pendingEmailVerification.token !== req.body.token) {
//     rep.status(401);
//     return "InvalidToken";
//   }

//   const user = await db.user.findFirstOrThrow({
//     where: {
//       id: pendingEmailVerification.userId,
//     },
//   });

//   req.session.authentication = {
//     email: user.email,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     pronouns: user.pronouns,
//     userId: user.id,
//   };

//   await db.pendingEmailVerification.delete({
//     where: {
//       id: pendingEmailVerification.id,
//     },
//   });

//   return "Your email has been confirmed and you are now logged in";
// };

// POST.opts = {
//   schema: {
//     body: Body,
//     response: {
//       200: Reply,
//       401: ErrorReply,
//     },
//   },
// };
