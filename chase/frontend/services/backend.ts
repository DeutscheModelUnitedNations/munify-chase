import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";
import { unstable_noStore as noStore } from "next/cache";

function getBackendUrl() {
  noStore();
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    console.warn("Could not read production backend url");
  }
  //TODO how the hell do we do this in next without hardcoding?!
  // return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  return "https://chase-backend.dmun.de";
}

export const backend = edenTreaty<App>(getBackendUrl(), {
  $fetch: {
    credentials: "include",
  },
});
