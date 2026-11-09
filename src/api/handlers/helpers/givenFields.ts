type Given<A, K extends keyof A, C extends keyof A> = {
	[P in Exclude<K, C>]?: NonNullable<A[P]>;
} & {
	[P in C]?: A[P] | null;
};

/**
 * The fields of a partial update the caller gave. `keys` count when set to a value, `clearable`
 * ones also when set to `null` (which clears them); fields left out stay untouched.
 */
export function givenFields<A extends object, K extends keyof A, C extends keyof A = never>({
	args,
	keys,
	clearable = []
}: {
	args: A;
	keys: readonly K[];
	clearable?: readonly C[];
}): Given<A, K, C> {
	const fields: Partial<Record<keyof A, unknown>> = {};
	for (const key of keys) {
		if (args[key] !== undefined && args[key] !== null) fields[key] = args[key];
	}
	for (const key of clearable) {
		if (args[key] !== undefined) fields[key] = args[key];
	}
	return fields as Given<A, K, C>;
}

/** Whether a partial update has anything to write. */
export function hasFields(fields: object) {
	return Object.keys(fields).length > 0;
}
