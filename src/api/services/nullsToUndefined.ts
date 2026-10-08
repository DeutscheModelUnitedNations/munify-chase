/**
 * Turns the `null`s of optional GraphQL args into `undefined`, which Drizzle's `.set()`
 * skips, so an update only touches the fields a client actually sent.
 */
export function nullsToUndefined<T extends Record<string, unknown>>(
	args: T
): { [K in keyof T]: Exclude<T[K], null> | undefined } {
	return Object.fromEntries(
		Object.entries(args).map(([key, value]) => [key, value ?? undefined])
	) as { [K in keyof T]: Exclude<T[K], null> | undefined };
}
