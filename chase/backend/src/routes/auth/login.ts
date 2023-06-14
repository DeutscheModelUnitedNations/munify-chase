import { NowRequestHandler } from "fastify-now";
import { Static, Type } from "@sinclair/typebox";
import { db } from "../../../prisma/client";
// import {verify} from "argon2";

const Body = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});
type BodyType = Static<typeof Body>;

const Reply = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
});
type ReplyType = Static<typeof Reply>;

const ErrorResponse = Type.Union([
  Type.Literal("CouldNotFindUser"),
  Type.Literal("InvalidPassword"),
]);
type ErrorReplyType = Static<typeof ErrorResponse>;

export const POST: NowRequestHandler<{
  Body: BodyType;
  Reply: ReplyType | ErrorReplyType;
}> = async (req, rep) => {
  const user = await db.user.findFirst({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    rep.status(401);
    return "CouldNotFindUser";
  }

  // if (!(await verify(user.passwordHash, req.body.password))) {
  //   rep.status(401);
  //   return "InvalidPassword";
  // }

  req.session.authentication = {
    email: req.body.email,
    firstName: "Antonio",
    lastName: "Guterres",
    pronouns: "he/him",
    userId: "1",
  };

  return {
    firstName: "FirstName",
    lastName: "LastName",
  };
};

POST.opts = {
  schema: {
    body: Body,
    response: {
      200: Reply,
      401: ErrorResponse,
    },
  },
};
