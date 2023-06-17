// import { NowRequestHandler } from "fastify-now";
// import { Static, Type } from "@sinclair/typebox";
// import { db } from "../../../prisma/client";
// import { verify } from "argon2";

// const Body = Type.Object({
//   password: Type.String(),
//   email: Type.String({ format: "email" }),
// });
// type BodyType = Static<typeof Body>;

// const Reply = Type.Object({
//   firstName: Type.String(),
//   lastName: Type.String(),
//   pronouns: Type.String(),
// });
// type ReplyType = Static<typeof Reply>;

// const ErrorReply = Type.Union([
//   Type.Literal("CouldNotFindUser"),
//   Type.Literal("InvalidPassword"),
//   Type.Literal("EmailNotVerified"),
// ]);
// type ErrorReplyType = Static<typeof ErrorReply>;

// export const POST: NowRequestHandler<{
//   Body: BodyType;
//   Reply: ReplyType | ErrorReplyType;
// }> = async (req, rep) => {
//   const user = await db.user.findFirst({
//     where: {
//       email: req.body.email,
//     },
//     include: {
//       pendingEmailVerification: true,
//     },
//   });

//   if (!user) {
//     rep.status(401);
//     return "CouldNotFindUser";
//   }

//   if (user.pendingEmailVerification) {
//     rep.status(401);
//     return "EmailNotVerified";
//   }

//   if (!(await verify(user.passwordHash, req.body.password))) {
//     rep.status(401);
//     return "InvalidPassword";
//   }

//   req.session.authentication = {
//     email: user.email,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     pronouns: user.pronouns,
//     userId: user.id,
    
//   };

//   return {
//     firstName: req.session.authentication?.firstName,
//     lastName: req.session.authentication?.lastName,
//     pronouns: req.session.authentication?.pronouns,
//   };
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
