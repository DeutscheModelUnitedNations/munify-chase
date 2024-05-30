import Elysia, { t } from "elysia";
import { type BaseClient, Issuer } from "openid-client";
import { appConfiguration } from "../util/config";

const client = await new Promise<BaseClient>((resolve) => {
  const r = async () => {
    try {
      const issuer = await Issuer.discover(appConfiguration.oidc.issuer);
      const client = new issuer.Client({
        client_id: appConfiguration.oidc.clientId,
      });
      resolve(client);
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
        username: string;
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

    const introResult = await client.introspect(token);

    res.user = {
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      username: introResult.username!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      id: introResult.sub!,
    };

    return { intro: res };
  });
