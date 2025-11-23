import type { RequestEvent } from "@sveltejs/kit";
import { log } from "console";
import { schemaBuilder } from "$api/rumble";

export type AuthenticatedUserData = NonNullable<
  NonNullable<RequestEvent["locals"]["oidc"]>["user"]
>;

schemaBuilder.queryFields((t) => {
  return {
    me: t.field({
      type: schemaBuilder
        .objectRef<AuthenticatedUserData>("AuthenticatedUserData")
        .implement({
          fields: (t) => ({
            sub: t.exposeString("sub"),
            email: t.exposeString("email"),
            locale: t.exposeString("locale"),
            preferred_username: t.exposeString("preferred_username"),
            family_name: t.exposeString("family_name"),
            given_name: t.exposeString("given_name"),
            phone: t.exposeString("phone"),
          }),
        }),
      nullable: false,
      resolve: (_root, _args, context) => context.mustBeLoggedIn(),
    }),
  };
});
