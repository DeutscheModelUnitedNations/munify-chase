import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

/**
 * This hook prevents the access to the route when there is no valid session or the user is not logged in. It ensures the presence of the session.authentication object
 */
export function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void,
) {
  if (req.session.authentication) {
    done();
  } else {
    rep.code(401).send(new Error("Unauthorized"));
  }
}
