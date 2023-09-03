import {Elysia, t} from "elysia";
import {bearer} from "@elysiajs/bearer";
import {Permissions, User, introspect} from "auth";
import {isAuthMocked} from "munify-util";

// while developing and not running a live ZITADEL instance, you can adjust this to test permission related things for incoming requests
// if you want to simulate a unauthorized request, just set this to undefined
const mockedIntrospection: {user: User; permissions: Permissions} = {
  user: {
    email: "test@test.de",
    email_verified: true,
    family_name: "Test",
    given_name: "Test",
    id: "42d35a24-cd3e-4625-9b91-b6510f728cc3",
    locale: "de",
    pronouns: "he/him",
  },
  permissions: new Permissions("42d35a24-cd3e-4625-9b91-b6510f728cc3", {
    chairPermissions: [],
    conferenceAdminPermissions: [],
    nonStateActorPermissions: [],
    pronouns: "he/him",
    representativePermissions: [],
    secretaryMemberPermissions: [],
    visitorPermissions: [],
  })
}

export const auth = (app: Elysia) => {
  return app
    .guard({
      headers: t.Object({
        authorization: t.String(),
      }),
    })
    .use(bearer())
    .derive(async ({bearer}) => {
      return {
        auth: isAuthMocked() ? mockedIntrospection : await introspect(bearer as string),
      };
    })
    .guard({
      beforeHandle: [
        async ({auth}) => {
          if (!auth) {
            return new Response(null, {status: 401});
          }
        },
      ],
    });
};
