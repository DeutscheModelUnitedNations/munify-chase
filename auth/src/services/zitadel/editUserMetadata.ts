import {Metadata, MetadataKeys} from "./parseMetadata";

export const ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN =
  process.env.ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN;
if (!ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN) {
  throw new Error(
    "ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN env var is not defined",
  );
}

export async function setUserMetadata(
  userId: number,
  metadata: Partial<Metadata>,
) {
  const body: {key: string, value: string}[] = [];

  Object.entries(metadata).forEach(([key, value]) => {
    body.push({
      key,
      value: Buffer.from(JSON.stringify(value)).toString("base64"),
    });
  });

  if(body.length === 0) {
    return;
  }

  const res = await fetch(
    `${process.env.OPENID_URL}/management/v1/users/${userId}/metadata/_bulk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.status.toString().startsWith("2")) {
    throw new Error(`Failed to set user metadata: ${await res.text()}`);
  }
}
