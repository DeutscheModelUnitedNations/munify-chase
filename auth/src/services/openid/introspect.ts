import {User} from "../../types/metadata";
import {Permissions} from "../../types/permissions";
import {requireEnv} from "../../../../util/envloader";
import {
  ZITADEL_METADATA_CLAIM,
  parseMetadata,
} from "../zitadel/parseMetadata";

const OPENID_URL = requireEnv("OPENID_URL");
const ZITADEL_USERNAME = requireEnv("ZITADEL_USERNAME");
const ZITADEL_PASSWORD = requireEnv("ZITADEL_PASSWORD");

interface WellKnownData {
  introspection_endpoint: string;
}

async function fetchWellKnownData(): Promise<WellKnownData | undefined> {
  try {
    const res = await fetch(
      `${OPENID_URL}/.well-known/openid-configuration`
    );

    if (!res.status.toString().startsWith("2")) {
      throw new Error(`Well known data request errored: ${await res.text()}`);
    }
    const data = await res.json();
    console.info("Well known data fetched successfully");
    return data;
  } catch (error) {
    console.error("Failed to fetch well known data, retrying...", error);
    return undefined;
  }
}

let wellKnownData = await fetchWellKnownData();

/**
 * Returns the parsed user data or undefined if the user is not authorized
 */
export async function introspect(
  token: string,
): Promise<{user: User; permissions: Permissions} | undefined> {
  const params = new URLSearchParams();
  params.append("token", token);

  const authorizationHeaderContent = Buffer.from(`${ZITADEL_USERNAME}:${ZITADEL_PASSWORD}`).toString("base64");

  // retry fetch if we havent succeeded yet
  if (!wellKnownData) {
    wellKnownData = await fetchWellKnownData();
    if (!wellKnownData) {
      throw new Error("Could not fetch well known data");
    }
  }
  const req = await fetch(wellKnownData.introspection_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authorizationHeaderContent}`

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
