import type { RequestEvent } from "@sveltejs/kit";
import { configPrivate } from "$lib/config/private";

export const oidcRoles = ["admin", "member", "service_user"] as const;

export async function context(req: RequestEvent) {
  const OIDCRoleNames: (typeof oidcRoles)[number][] = [];
  if (configPrivate.OIDC_ROLE_CLAIM) {
    const rolesRaw =
      (req.locals.oidc?.accessToken ?? ({} as any))[
        configPrivate.OIDC_ROLE_CLAIM
      ] ??
      (req.locals.oidc?.idToken ?? ({} as any))[
        configPrivate.OIDC_ROLE_CLAIM
      ] ??
      {};
    if (rolesRaw) {
      const roleNames = Object.keys(rolesRaw);
      OIDCRoleNames.push(...(roleNames as any));
    }
  }

  return {
    ...req.locals,
    mustBeLoggedIn: () => {
      if (!req.locals.oidc?.user) {
        throw new Error("Must be logged in");
      }

      return req.locals.oidc.user;
    },
    hasRole(role: string) {
      return OIDCRoleNames.includes(role as any);
    },
  };
}

export type Context = Awaited<ReturnType<typeof context>>;
