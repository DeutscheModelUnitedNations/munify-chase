/**
 * GQty: You can safely modify this file based on your needs.
 */

import { createReactClient } from "@gqty/react";
import { createClient as createSubscriptionsClient } from "graphql-ws";
import { Cache, GQtyError, createClient, type QueryFetcher } from "gqty";
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from "./schema.generated";

const queryFetcher: QueryFetcher = async (
  { query, variables, operationName, extensions },
  fetchOptions,
) => {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: extensions?.access_token
        ? `Bearer ${extensions.access_token}`
        : // biome-ignore lint/suspicious/noExplicitAny:
          (undefined as any),
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    credentials: "include",
    mode: "cors",
    ...fetchOptions,
  });

  if (response.status >= 400) {
    throw new GQtyError(
      `GraphQL endpoint responded with HTTP status ${response.status}.`,
    );
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new GQtyError(
      `Malformed JSON response: ${
        text.length > 50 ? `${text.slice(0, 50)}...` : text
      }`,
    );
  }
};

const subscriptionsClient =
  typeof window !== "undefined"
    ? createSubscriptionsClient({
        lazy: true,
        url: () => {
          // Modify if needed
          const url = new URL("/api/graphql", window.location.href);
          url.protocol = url.protocol.replace("http", "ws");
          return url.href;
        },
      })
    : undefined;

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  },
);

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
    subscriber: subscriptionsClient,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export const {
  graphql,
  useQuery,
  usePaginatedQuery,
  useTransactionQuery,
  useLazyQuery,
  useRefetch,
  useMutation,
  useMetaState,
  prepareReactRender,
  useHydrateCache,
  prepareQuery,
  useSubscription,
} = createReactClient<GeneratedSchema>(client, {
  defaults: {
    // Enable Suspense, you can override this option for each hook.
    suspense: true,
  },
});

export * from "./schema.generated";
