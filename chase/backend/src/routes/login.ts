import { NowRequestHandler } from "fastify-now";
import { Static, Type } from "@sinclair/typebox";

const User = Type.Object({
  password: Type.String(),
  email: Type.String({ format: "email" }),
});
export type UserType = Static<typeof User>;

export const POST: NowRequestHandler<{
  Body: UserType;
}> = async (req, rep) => {
  return "cool, it works";
};

POST.opts = {
  schema: {
    body: User,
  },
};
