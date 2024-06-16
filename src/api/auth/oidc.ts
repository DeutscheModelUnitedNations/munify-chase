import Elysia, { t } from "elysia";
import { type BaseClient, Issuer } from "openid-client";
import { appConfiguration } from "../util/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

const { JWKS, issuer } = await new Promise<{
  JWKS: ReturnType<typeof createRemoteJWKSet>;
  issuer: Issuer<BaseClient>;
}>((resolve) => {
  const r = async () => {
    try {
      const issuer = await Issuer.discover(appConfiguration.oidc.issuer);
      //TODO
      // const client = new issuer.Client({
      //   client_id: appConfiguration.oidc.clientId,
      //   token_endpoint_auth_method: "none"
      // });
      const JWKS = await createRemoteJWKSet(
        // biome-ignore lint/style/noNonNullAssertion: we want this to fail if it's not defined
        new URL(issuer.metadata.jwks_uri!),
        {},
      );

      resolve({ JWKS, issuer });
    } catch (error) {
      console.error("Could not connect to OIDC server, retrying in 1s", error);
      setTimeout(() => {
        r();
      }, 1000);
    }
  };
  r();
});

export type IntrospectionResult = {
  user:
    | {
        id: string;
      }
    | undefined;
};

export const oidcPlugin = new Elysia({ name: "oidcPlugin" })
  .guard({
    headers: t.Object({
      authorization: t.Optional(t.String()),
    }),
  })
  .derive({ as: "global" }, async ({ headers }) => {
    const res: IntrospectionResult = {
      user: undefined,
    };

    const token = headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return { intro: res };
    }

    const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
      issuer: issuer.metadata.issuer,
      // audience: "urn:example:audience", TODO
    });

    res.user = {
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      id: payload.sub!,
    };

    return { intro: res };
  });
