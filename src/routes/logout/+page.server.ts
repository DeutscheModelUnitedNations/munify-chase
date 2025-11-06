import { redirect } from "@sveltejs/kit";
import { OIDC } from "$api/services/OIDC";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  redirect(308, await OIDC.getLogoutUrl(url));
};
