import { z } from "zod";
import { query } from "$app/server";

export const graphqlQuery = query(z.any(), async (p) => {
  console.log(p);

  return p;
});
