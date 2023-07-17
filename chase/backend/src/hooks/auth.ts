// rome-ignore lint/correctness/noUnusedVariables:
import {FastifyReply, FastifyRequest} from "fastify";
import {SignJWT} from "jose";
import {createPrivateKey} from "crypto";
import {parseMetadata} from "src/../../auth/src/services/zitadel/parseMetadata";
import {Grants} from "src/../../auth/src/services/grants/grants";

// augment the fastify module to provide intellisense for the session object on the req in handlers
declare module "fastify" {
  // rome-ignore lint/suspicious/noRedeclare:
  interface FastifyRequest {
    // session: SessionType;
    session: {
      userId: string;
      email: string;
      email_verified: boolean;
      family_name: string;
      given_name: string;
      username: string;
      nickname: string;
      locale: string;
      pronouns: string;
      grants: Grants
    };
  }
}

const openidJsonSecretRaw = process.env.OPENID_APPLICATION_JSON_SECRET;
if (!openidJsonSecretRaw) {
  throw new Error("OPENID_APPLICATION_JSON_SECRET env var must be set");
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
    .setProtectedHeader({alg: "RS256", kid: openidJsonSecret.keyId})
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
      const data = await (
        await fetch(
          `${process.env.OPENID_URL}/.well-known/openid-configuration`,
        )
      ).json();
      console.info("Well known data fetched successfully");
      return data;
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
    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
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

  if (!introspectionData.active) {
    rep.code(401).send(new Error("Unauthorized"));
    return;
  }

  const metadata = parseMetadata(introspectionData['urn:zitadel:iam:user:metadata'])

  if (!req.session) {
    req.session = {
      userId: introspectionData.sub,
      email: introspectionData.email,
      email_verified: introspectionData.email_verified,
      family_name: introspectionData.family_name,
      given_name: introspectionData.given_name,
      locale: introspectionData.locale,
      nickname: introspectionData.nickname,
      username: introspectionData.username,
      pronouns: metadata.pronouns,
      grants: new Grants(introspectionData.sub, metadata)
    };
  } else {
    req.session.userId = introspectionData.sub;
    req.session.email = introspectionData.email;
    req.session.email_verified = introspectionData.email_verified;
    req.session.family_name = introspectionData.family_name;
    req.session.given_name = introspectionData.given_name;
    req.session.locale = introspectionData.locale;
    req.session.nickname = introspectionData.nickname;
    req.session.username = introspectionData.username;
    req.session.pronouns = metadata.pronouns
    req.session.grants = new Grants(introspectionData.sub, metadata)
  }

  //TODO extract permissions and set them on req object/create helpers
  // console.log(req.session);
  console.log(await jwt)
}
