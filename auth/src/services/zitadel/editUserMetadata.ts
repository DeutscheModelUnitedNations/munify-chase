import { Metadata } from "./parseMetadata";

const ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN =
  process.env.ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN;
if (!ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN) {
  throw new Error(
    "ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN env var is not defined",
  );
}

export async function setUserMetadata(
  userId: string,
  metadata: Partial<Metadata>,
) {
  console.log({ userId });

  return Promise.all(
    Object.entries(metadata).map(async ([key, data]) => {
      const res = await fetch(
        `${process.env.OPENID_URL}/management/v1/users/${userId}/metadata/${key}`,
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

      if (!res.status.toString().startsWith("2")) {
        throw new Error(`Failed to set user metadata: ${await res.text()}`);
      }

      return res;
    }),
  );
}
