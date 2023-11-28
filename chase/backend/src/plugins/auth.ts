import { Elysia } from "elysia";
import { Permissions, User, introspect } from "authentication";
import { isAuthMocked } from "helpers";
import { Metadata } from "authentication";
import { join } from "node:path";
import { bearer } from "@elysiajs/bearer";

// while developing and not running a live ZITADEL instance, you can adjust this to test permission related things for incoming requests
// if you want to simulate a unauthorized request, just set this to undefined
let mockedPermissions: Metadata = {
  chairPermissions: [],
  conferenceAdminPermissions: [],
  nonStateActorPermissions: [],
  pronouns: "he/him",
  representativePermissions: [],
  secretaryMemberPermissions: [],
  visitorPermissions: [],
};

let mockedUser: User = {
  email: "test@test.de",
  email_verified: true,
  family_name: "Test",
  given_name: "Test",
  id: "42d35a24-cd3e-4625-9b91-b6510f728cc3",
  locale: "de",
  pronouns: "he/him",
};

if (isAuthMocked()) {
  // load existing values if any
  const devpath = join(import.meta.dir, "mockedAuth.json");
  const file = Bun.file(devpath);
  {
    if (await file.exists()) {
      const mocks = JSON.parse(await file.text());
      mockedPermissions = mocks.permissions;
      mockedUser = mocks.user;
    }
  }

  // save values to disk
  setInterval(async () => {
    Bun.write(
      devpath,
      JSON.stringify({ permissions: mockedPermissions, user: mockedUser })
    );
  }, 1000);
}

const mockedIntrospection: { user: User; permissions: Permissions } = {
  user: mockedUser,
  //TODO consider making this permanent, maybe store on disk somewhere
  permissions: new Permissions(
    mockedUser.id,
    mockedPermissions,
    async (userId, metadata) => {
      // we dont really care about other permissions in this scenario
      if (userId !== mockedUser.id) {
        console.info(
          "tried to set metadata for user that is not the mocked user"
        );
        return;
      }
      Object.entries(metadata).map(async ([key, data]) => {
        // biome-ignore lint/suspicious/noExplicitAny:
        mockedPermissions[key as keyof Metadata] = data as any;
      });
    }
  ),
};

class AuthError extends Error {}

//TODO separate plugin for different auth states? (auth, isConferenceAdmin, isChar, etc.)
export const auth = new Elysia({
  name: "auth", // set name to avoid duplication on multiple uses https://elysiajs.com/concept/plugin.html#plugin-deduplication
})
  .use(bearer())
  .error({ AUTH_ERROR: AuthError })
  .onError(({ code }) => {
    if (code === "AUTH_ERROR") {
      return new Response("UNAUTHORIZED", {
        status: 401,
      });
    }
  })
  .derive(async ({ bearer }) => {
    if (isAuthMocked()) {
      return { auth: mockedIntrospection };
    }

    if (!bearer) {
      throw new AuthError("No bearer token provided");
    }

    const auth = await introspect(bearer);

    if (!auth) {
      throw new AuthError("Invalid token");
    }

    return { auth };
  });
// .derive(async ({ bearer }) => {
//   if (isAuthMocked()) {
//     return { auth: mockedIntrospection };
//   }

//   if (!bearer) {
//     return new Response("No bearer token provided", {
//       status: 401,
//     });
//   }

//   const auth = await introspect(bearer);

//   if (!auth) {
//     return new Response("Invalid token", {
//       status: 401,
//     });
//   }

//   return { auth };
// });
// .guard({
//   headers: t.Object({
//     authorization: t.String(),
//   }),
//   beforeHandle: [
//     async ({ set, headers }) => {
//       const bearer = headers.authorization?.replace("Bearer ", "");
//       const auth = isAuthMocked()
//         ? mockedIntrospection
//         : // biome-ignore lint/style/noNonNullAssertion: we check for non null in the guard and want the correct type to be propagated by this plugin
//           (await introspect(bearer as string))!;

//       if (!auth) {
//         set.status = "Unauthorized";
//         return "Unauthorized";
//       }

//       return { auth };
//     },
//   ],
// });

// return (app: Elysia) =>
// app
//   .state('basicAuthRealm', null as string | null)
//   .state('basicAuthUser', null as string | null)
//   .addError({ BASIC_AUTH_ERROR: BasicAuthError })
//   .onError(({ code, error }) => {
//     if (code === 'BASIC_AUTH_ERROR' && error.realm === options.realm) {
//       return new Response(options.unauthorizedMessage, {
//         status: options.unauthorizedStatus,
//         headers: { 'WWW-Authenticate': `Basic realm="${options.realm}"` },
//       })
//     }
//   })
//   .onRequest(ctx => {
//     if (options.enabled && inScope(ctx) && !skipRequest(ctx.request)) {
//       const authHeader = ctx.request.headers.get(options.header)
//       if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
//         throw new BasicAuthError('Invalid header', options.realm)
//       }

//       const credentials = getCredentials(authHeader)
//       if (!checkCredentials(credentials, credentialsMap)) {
//         throw new BasicAuthError('Invalid credentials', options.realm)
//       }

//       ctx.store.basicAuthRealm = options.realm
//       ctx.store.basicAuthUser = credentials.username
//     }
//   })
