import type { RequestEvent } from '@sveltejs/kit';
import { schemaBuilder } from '$api/rumble';

export type AuthenticatedUserData = NonNullable<
  NonNullable<RequestEvent['locals']['oidc']>['user']
>;

type NonNullableProps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type UnNullyUser = NonNullableProps<Required<AuthenticatedUserData>>;

schemaBuilder.queryFields((t) => {
  return {
    me: t.field({
      type: schemaBuilder.objectRef<UnNullyUser>('AuthenticatedUserData').implement({
        fields: (t) => ({
          sub: t.exposeString('sub'),
          email: t.exposeString('email'),
          locale: t.exposeString('locale'),
          preferred_username: t.exposeString('preferred_username'),
          family_name: t.exposeString('family_name'),
          given_name: t.exposeString('given_name')
        })
      }),
      nullable: false,
      resolve: (_root, _args, context) => context.mustBeLoggedIn() as UnNullyUser
    })
  };
});
