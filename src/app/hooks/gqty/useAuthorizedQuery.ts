import { useMutation, useQuery } from "@/app/gqty/gqty";
import { useAuth } from "react-oidc-context";

export function useAuthorizedQuery<Q extends typeof useQuery>(
  ...params: Parameters<Q>
) {
  const auth = useAuth();

  if (auth && !auth.isAuthenticated && auth.user?.access_token) {
    // biome-ignore lint/suspicious/noExplicitAny:
    (params[0]?.extensions as any).access_token = auth.user.access_token;
  }

  return useQuery(...params);
}

export function useAuthorizedMutation<M extends typeof useMutation>(
  ...params: Parameters<M>
) {
  const auth = useAuth();

  if (auth && !auth.isAuthenticated && auth.user?.access_token) {
    // biome-ignore lint/suspicious/noExplicitAny:
    (params[1]?.extensions as any).access_token = auth.user.access_token;
  }

  return useMutation(params[0], params[1]);
}
