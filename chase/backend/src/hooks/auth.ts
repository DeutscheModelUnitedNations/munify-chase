import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { server } from "../main";

// decorate to optimize the js engine
// https://www.fastify.io/docs/latest/Reference/Decorators/
server.decorateRequest("session", {
  cookie: {
    originalMaxAge: 0,
    domain: "",
    expires: new Date(),
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: true,
    secure: true,
    signed: true,
  },
  authentication: {
    userId: "",
    email: "",
    firstName: "",
    lastName: "",
    pronouns: "",
  },
});

export function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void
) {
  if (req.session.authentication) {
    done();
  } else {
    rep.code(401).send(new Error("Unauthorized"));
  }
}
