import { FastifyReply, FastifyRequest } from "fastify";
import { Permissions, User, introspect } from "auth";

// augment the fastify module to provide intellisense for the session object on the req in handlers
declare module "fastify" {
  // rome-ignore lint/suspicious/noRedeclare: <explanation>
  interface FastifyRequest {
    // session: SessionType;
    session: {
      user: User;
      permissions: Permissions;
    };
  }
}

// TODO investigate if this is the way
// decorate to optimize the js engine
// https://www.fastify.io/docs/latest/Reference/Decorators/
// decorating with a shared object is ok here, since we replace the value at req time with a new object
// const defaultSessionValue: SessionType = {
//   authentication: {
//     email: "",
//     firstName: "",
//     lastName: "",
//     pronouns: "",
//     userId: 0,
//   },
// };
// server.decorateRequest("session", defaultSessionValue);

/**
 * This hook prevents the access to the route when there is no valid session or the user is not authenticated
 */
export async function authenticated(req: FastifyRequest, rep: FastifyReply) {
  const _ = req.headers["authorization-id-token"];
  const access_token = req.headers["authorization"];

  if (!access_token) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  if (!access_token.startsWith("Bearer ")) {
    rep.code(400).send(new Error("Malformed auth header"));
    return;
  }

  const introspectionData = await introspect(
    access_token.substring("Bearer ".length),
  );

  if (!introspectionData) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  if (!req.session) {
    req.session = introspectionData;
  } else {
    req.session.user = introspectionData.user;
    req.session.permissions = introspectionData.permissions;
  }
}
