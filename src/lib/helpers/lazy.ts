import { building } from '$app/environment';

/**
 * Lazy initializer for static values
 */
export function lazy<Result>(initializer: () => Result, mockOnBuild = false): () => Result {
	let value: Result | undefined = undefined;
	return () => {
		if (building && mockOnBuild) {
			return value as Result;
		}

		if (value === undefined) {
			value = initializer();
			return value;
		}
		return value;
	};
}
