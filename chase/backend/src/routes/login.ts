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
});
type ReplyType = Static<typeof Reply>;

const ErrorResponse = Type.Union([
  Type.Literal("CouldNotFindUser"),
  Type.Literal("InvalidPassword"),
]);

export const POST: NowRequestHandler<{
  Body: BodyType;
  Reply: ReplyType;
}> = async (req, rep) => {
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
