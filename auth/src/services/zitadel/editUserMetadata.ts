import {requireEnv} from "../../../../util/envloader";
import {Metadata} from "./parseMetadata";

const OPENID_URL = requireEnv("OPENID_URL");
const ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN = requireEnv("ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN");

export async function setUserMetadata(
  userId: string,
  metadata: Partial<Metadata>,
) {
  return Promise.all(
    Object.entries(metadata).map(async ([key, data]) => {
      const res = await fetch(
        `${OPENID_URL}/management/v1/users/${userId}/metadata/${key}`,
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
