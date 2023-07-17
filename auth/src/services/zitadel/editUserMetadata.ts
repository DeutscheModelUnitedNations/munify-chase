import {UserMetadata} from "../../types/metadata";

const ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN = process.env.ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN;
if (!ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN) {
  throw new Error("ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN env var is not defined");
}

export async function setUserMetadata(
  userId: string,
  metadata: Partial<UserMetadata>
) {
  Promise.all(Object.entries(metadata).map(([key, data]) => {
    return fetch(
      `https://${process.env.OPENID_URL}/management/v1/users/${userId}/metadata/${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          value: Buffer.from(JSON.stringify(data)).toString("base64"),
        }),
      },
    );
  }));
}