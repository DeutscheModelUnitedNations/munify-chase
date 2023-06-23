import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { server } from "../main";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

// use typebox to define our session type
export const sessionSchema = Type.Object({
  authentication: Type.Object({
    userId: Type.Number(),
    email: Type.String({ format: "email" }),
    firstName: Type.String(),
    lastName: Type.String(),
    pronouns: Type.String(),
  }),
});

// compile schema to validate tokens at req time
const compiledSessionSchema = TypeCompiler.Compile(sessionSchema);

// create ts type from typebox
type SessionType = Static<typeof sessionSchema>;

// augment the fastify module to provide intellisense for the session object on the req in handlers
declare module "fastify" {
  // rome-ignore lint/suspicious/noRedeclare: <explanation>
  interface FastifyRequest {
    session: SessionType;
  }
}

// TODO investigate if this is the way
// decorate to optimize the js engine
// https://www.fastify.io/docs/latest/Reference/Decorators/
// decorating with a shared object is ok here, since we replace the value at req time with a new object
const defaultSessionValue: SessionType = {
  authentication: {
    email: "",
    firstName: "",
    lastName: "",
    pronouns: "",
    userId: 0,
  },
};
server.decorateRequest("session", defaultSessionValue);

// fetch the token specifications from keycloak
const jwks = createRemoteJWKSet(
  new URL(`${process.env.KEYCLOAK_REALM_URL}/protocol/openid-connect/certs`)
);

/**
 * This hook prevents the access to the route when there is no valid session or the user is not authenticated
 */
export async function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void
) {
  if (
    req.headers.authorization === undefined ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    rep.code(401).send(new Error("Unauthorized: Bearer missing"));
    return;
  }

  const token = req.headers.authorization.substring("Bearer ".length);

  try {
    const { payload } = await jwtVerify(token, jwks);
    console.log(payload);
    if (!payload.sub) {
      rep.code(401).send(new Error("Unauthorized: Sub undefined"));
      return;
    }

    // Continue here. Check how to manipulate the type and strongly type the session data
    const sessionData = JSON.parse(payload.sub);
    if (!compiledSessionSchema.Check(sessionData)) {
      rep.code(401).send(new Error("Unauthorized: Malformed token"));
      return;
    }

    req.session = sessionData;
  } catch (error) {
    console.error(error);
    rep.code(401).send(new Error("Unauthorized: JWT not verified"));
  }

  done();
}
