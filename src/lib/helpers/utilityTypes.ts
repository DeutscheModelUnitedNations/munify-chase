/**
 * Merges two types T and U by including all keys from both types.
 *
 * For each key:
 * - If the key exists in T, its type is taken from T.
 * - Otherwise, if the key exists in U, its type is taken from U.
 * - Otherwise, the type resolves to undefined.
 *
 * @typeParam T - The first type whose keys take precedence over U.
 * @typeParam U - The second type.
 */
export type MergeWithUndefined<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? T[K]
    : K extends keyof U
      ? U[K]
      : undefined;
};
