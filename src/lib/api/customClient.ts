import { nativeDateExchange } from "@m1212e/rumble";
import {
  Client,
  CombinedError,
  type Exchange,
  fetchExchange,
} from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  empty,
  filter,
  fromPromise,
  fromValue,
  merge,
  mergeMap,
  never,
  pipe,
} from "wonka";
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
          return empty;
        }

        const processResult = (
          caller: typeof graphqlQuery | typeof graphqlMutation,
        ) => {
          return fromPromise(
            (async () => {
              const result = await caller({
                query: operation.query,
                variables: operation.variables as Exclude<
                  typeof operation.variables,
                  void
                >,
              });

              return {
                operation,
                data: result.data,
                error: Array.isArray(result.errors)
                  ? new CombinedError({
                      graphQLErrors: result.errors,
                    })
                  : undefined,
                extensions: result.extensions
                  ? { ...result.extensions }
                  : undefined,
                stale: false,
              };
            })(),
          );
        };

        if (operation.kind === "query") {
          return processResult(graphqlQuery);
        }

        if (operation.kind === "mutation") {
          return processResult(graphqlMutation);
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
    // cacheExchange(),
    nativeDateExchange,
    remoteFunctionsExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include",
  },
  requestPolicy: "cache-and-network",
});
