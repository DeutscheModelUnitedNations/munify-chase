import { SignJWT } from "jose";
import { createPrivateKey } from "crypto";
import { User } from "../../types/metadata";
import { Permissions } from "../../types/permissions";
import {
  ZITADEL_METADATA_CLAIM,
  parseMetadata,
} from "../zitadel/parseMetadata";

const openidJsonSecretRaw = process.env.OPENID_APPLICATION_JSON_SECRET;
if (!openidJsonSecretRaw) {
  throw new Error("OPENID_APPLICATION_JSON_SECRET env var must be set");
}
const parsedSecret = JSON.parse(openidJsonSecretRaw);

function generateToken() {
  return new SignJWT({})
    .setIssuedAt()
    .setExpirationTime("1h")
    .setIssuer(parsedSecret.clientId)
    .setAudience("http://localhost:7788") //TODO NO-113 replace with real values
    .setSubject(parsedSecret.clientId)
    .setProtectedHeader({ alg: "RS256", kid: parsedSecret.keyId })
    .sign(createPrivateKey(parsedSecret.key));
}

let jwt = generateToken();

setInterval(() => {
  jwt = generateToken();
}, 1000 * 60 * 58);

const wellKnownData = (async () => {
  async function run() {
    try {
      //TODO NO-114 could be a good idea to use openid-client for at least fetching the well known data and creating an issuer instance
      const res = await fetch(
        `${process.env.OPENID_URL}/.well-known/openid-configuration`,
      );

      if (!res.status.toString().startsWith("2")) {
        throw new Error(`Well known data request errored: ${await res.text()}`);
      }
      const data = await res.json();
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

/**
 * Returns the parsed user data or undefined if the user is not authorized
 */
export async function introspect(
  token: string,
): Promise<{ user: User; permissions: Permissions } | undefined> {
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

  const parsedIntrospectionData = await req.json();

  if (!parsedIntrospectionData.active) {
    return undefined;
  }

  const parsedMetadata = parseMetadata(
    parsedIntrospectionData[ZITADEL_METADATA_CLAIM],
  );

  const userId = parsedIntrospectionData.sub;

  return {
    user: {
      email: parsedIntrospectionData.email,
      email_verified: parsedIntrospectionData.email_verified,
      family_name: parsedIntrospectionData.family_name,
      given_name: parsedIntrospectionData.given_name,
      id: userId,
      locale: parsedIntrospectionData.locale,
      pronouns: parsedMetadata.pronouns,
    },
    permissions: new Permissions(userId, parsedMetadata),
  };
}
