import { requireEnvWhenAuthNotMocked } from "../../../../munify-util/src/envloader";
import { Metadata } from "./parseMetadata";

//TODO spend some precious time to find out if roles might be the better way to tackle this

const OPENID_URL = requireEnvWhenAuthNotMocked("OPENID_URL");
const ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN = requireEnvWhenAuthNotMocked(
  "ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN",
  );
  
  export type MetadataSetter = (userId: string, metadata: Partial<Metadata>) => Promise<Response[] | void>;
  
  // ATTENTION: This procedure assumes that there is only every one instance writing the metadata at the issuer at the same time
  // if two instances write at the same time, the last one will overwrite the first one
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
