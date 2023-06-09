import { NowRequestHandler } from "fastify-now";
import { Static, Type } from "@sinclair/typebox";

const Body = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});
type BodyType = Static<typeof Body>;

const Reply = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  pronouns: Type.String(),
});
type ReplyType = Static<typeof Reply>;

const ErrorReply = Type.Union([
  Type.Literal("CouldNotFindUser"),
  Type.Literal("InvalidPassword"),
]);
type ErrorReplyType = Static<typeof ErrorReply>;

export const POST: NowRequestHandler<{
  Body: BodyType;
  Reply: ReplyType | ErrorReplyType;
}> = async (req, rep) => {
  if (req.body.email !== "admin@dmun.de" || req.body.password !== "1234") {
    rep.status(401);
    return "InvalidPassword";
  }

  req.session.authentication = {
    email: req.body.email,
    firstName: "Antonio",
    lastName: "Guterres",
    pronouns: "he/him",
    userId: "1",
  };

  return {
    firstName: req.session.authentication?.firstName,
    lastName: req.session.authentication?.lastName,
    pronouns: req.session.authentication?.pronouns,
  };
};

POST.opts = {
  schema: {
    body: Body,
    response: {
      200: Reply,
      401: ErrorReply,
    },
  },
};
