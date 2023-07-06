"use client";
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

const JWKSet = (async () => {
  const wellKnown = await (
    await fetch(`${process.env.OPENID_URL}/.well-known/openid-configuration`)
  ).json();

  return createRemoteJWKSet(new URL(wellKnown.jwks_uri));
})();

/**
 * This hook prevents the access to the route when there is no valid session or the user is not authenticated
 */
export async function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void
) {
  const id_token = req.headers["authorization-id-token"];
  const access_token = req.headers["authorization"];

  if (!access_token && !id_token) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  let parsed_access_token;
  let parsed_id_token;

  if (access_token && typeof access_token === "string") {
    try {
      parsed_access_token = await jwtVerify(
        access_token.substring("Bearer ".length), // remove the "Bearer " prefix
        await JWKSet
      );
    } catch (error) {
      console.error(error);
      rep.code(401).send(new Error("Unauthorized: JWT not verified"));
      return;
    }
  }

  if (id_token && typeof id_token === "string") {
    try {
      parsed_id_token = await jwtVerify(id_token, await JWKSet);
    } catch (error) {
      console.error(error);
      rep.code(401).send(new Error("Unauthorized: JWT not verified"));
      return;
    }
  }

  if (!parsed_access_token && !parsed_id_token) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  console.log("parsed_id_token", parsed_id_token?.payload);
  console.log("parsed_access_token", parsed_access_token?.payload);

  compiledSessionSchema;
  done();
}
