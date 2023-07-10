import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { SignJWT } from "jose";
import { createPrivateKey } from "crypto";

// augment the fastify module to provide intellisense for the session object on the req in handlers
declare module "fastify" {
  // rome-ignore lint/suspicious/noRedeclare: <explanation>
  interface FastifyRequest {
    // session: SessionType;
    session: string;
  }
}

const openidJsonSecretRaw = process.env.OPENID_JSON_SECRET;
if (!openidJsonSecretRaw) {
  throw new Error("OPENID_JSON_SECRET env var must be set");
}
const openidJsonSecret = JSON.parse(openidJsonSecretRaw);

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
 * Generates a token using the provided information.
 *
 * @return {Promise<string>} The generated token.
 */
function generateToken() {
  return new SignJWT({})
    .setIssuedAt()
    .setExpirationTime("1h")
    .setIssuer(openidJsonSecret.clientId)
    .setAudience("http://localhost:7788") //TODO replace with real values
    .setSubject(openidJsonSecret.clientId)
    .setProtectedHeader({ alg: "RS256", kid: openidJsonSecret.keyId })
    .sign(createPrivateKey(openidJsonSecret.key));
}

let jwt = generateToken();
// refresh the token every hour
setInterval(() => {
  jwt = generateToken();
}, 1000 * 60 * 58);

const wellKnownData = (async () => {
  async function run() {
    try {
      return await (
        await fetch(
          `${process.env.OPENID_URL}/.well-known/openid-configuration`
        )
      ).json();
    } catch (error) {
      console.error("Failed to fetch well known data, retrying...", error);
      setTimeout(() => {
        run();
      }, 1000);
    }
  }
  return run();
})();

async function introspect(token: string) {
  const params = new URLSearchParams();
  params.append(
    "client_assertion_type",
    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
  );
  params.append("client_assertion", await jwt);
  params.append("token", token);

  const req = await fetch((await wellKnownData).introspection_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!req.status.toString().startsWith("2")) {
    throw new Error(`Introspection request errored: ${await req.text()}`);
  }

  return req.json();
}

/**
 * This hook prevents the access to the route when there is no valid session or the user is not authenticated
 */
export async function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void
) {
  // @ts-ignore
  const id_token = req.headers["authorization-id-token"];
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
    access_token.substring("Bearer ".length)
  );

  if (!introspectionData.active) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  done();
}
