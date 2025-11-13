import { nativeDateExchange } from "@m1212e/rumble";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { graphqlQuery } from "$api/graphql.remote";
import { defaultOptions } from "./rumbleClient/client";

console.log(defaultOptions);

export const urqlClient = new Client({
  url: "/api/graphql",
  fetchSubscriptions: true,
  exchanges: [
    fetchExchange({
      // TODO replace fetch exchange with rf call to custom query remote file query function
    }),
  ],
  fetchOptions: {
    credentials: "include",
  },
  requestPolicy: "cache-and-network",
});
