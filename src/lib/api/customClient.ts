import { nativeDateExchange } from "@m1212e/rumble";
import { Client, type Exchange, fetchExchange } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { empty, filter, fromValue, merge, mergeMap, never, pipe } from "wonka";
import { graphqlMutation, graphqlQuery } from "$api/graphql.remote";
import { browser } from "$app/environment";

/**
 * Exchange to perform graphql calls via sveltekit remote functions (if possible)
 */
const remoteFunctionsExchange: Exchange = ({ forward }) => {
  return (operations) => {
    const filtered = pipe(
      operations,
      filter((operation) => {
        return operation.kind !== "teardown";
      }),
      mergeMap((operation) => {
        if (!browser && operation.kind === "subscription") {
          // we cannot do subscriptions on the server yet https://github.com/sveltejs/kit/pull/12973#issuecomment-2981290155
          // for SSR we return empty here and let the fetchExchange handle it in the browser
          return never;
        }

        if (operation.kind === "query") {
          return fromValue(
            graphqlQuery({
              query: operation.query,
              variables: operation.variables as Exclude<
                typeof operation.variables,
                void
              >,
            }),
          );
        }

        if (operation.kind === "mutation") {
          return fromValue(
            graphqlMutation({
              query: operation.query,
              variables: operation.variables as Exclude<
                typeof operation.variables,
                void
              >,
            }),
          );
        }

        return empty;
      }),
    );

    const forwarded = pipe(
      operations,
      filter((operation) => {
        return (
          operation.kind === "teardown" ||
          // subscriptions are not supported in sveltekit remote functions yet
          // and need to run via default fetchExchange when inside the browser
          (browser && operation.kind === "subscription")
        );
      }),
      forward,
    );

    return merge([filtered, forwarded]);
  };
};

export const urqlClient = new Client({
  url: "/api/graphql",
  fetchSubscriptions: true,
  exchanges: [
    // TODO
    // cacheExchange({ schema }),
    cacheExchange(),
    nativeDateExchange,
    remoteFunctionsExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
  requestPolicy: "cache-and-network",
});
