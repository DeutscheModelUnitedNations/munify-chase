import { m } from '$lib/paraglide/messages';
import { CombinedError } from '@urql/core';

/**
 * Appends the first GraphQL error message from the backend to a base toast
 * message, so users see why their action was rejected rather than a generic
 * "Save failed" string.
 */
export function withBackendMessage(baseMsg: string, err: unknown): string {
	if (err instanceof CombinedError && err.graphQLErrors.length > 0) {
		return `${baseMsg}: ${err.graphQLErrors[0].message}`;
	}
	return baseMsg;
}

export function promiseToastStrings(
	targetName: string,
	action?: 'create' | 'delete' | 'update' | 'add'
) {
	switch (action) {
		case 'create':
			return {
				loading: m.toastCreateLoading({ targetName }),
				success: m.toastCreateSuccess({ targetName }),
				error: m.toastCreateError({ targetName })
			};
		case 'delete':
			return {
				loading: m.toastDeleteLoading({ targetName }),
				success: m.toastDeleteSuccess({ targetName }),
				error: m.toastDeleteError({ targetName })
			};
		case 'update':
			return {
				loading: m.toastUpdateLoading({ targetName }),
				success: m.toastUpdateSuccess({ targetName }),
				error: m.toastUpdateError({ targetName })
			};
		case 'add':
			return {
				loading: m.toastAddLoading({ targetName }),
				success: m.toastAddSuccess({ targetName }),
				error: m.toastAddError({ targetName })
			};
		default:
			return {
				loading: m.toastLoading({ targetName }),
				success: m.toastSuccess({ targetName }),
				error: m.toastError({ targetName })
			};
	}
}
