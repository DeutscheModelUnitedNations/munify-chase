import { m } from '#lib/paraglide/messages';
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

type ToastAction = 'create' | 'delete' | 'update' | 'add';
type ToastMessage = (inputs: { targetName: string }) => string;

const TOAST_MESSAGES: Record<ToastAction | 'default', [ToastMessage, ToastMessage, ToastMessage]> =
	{
		create: [m.toastCreateLoading, m.toastCreateSuccess, m.toastCreateError],
		delete: [m.toastDeleteLoading, m.toastDeleteSuccess, m.toastDeleteError],
		update: [m.toastUpdateLoading, m.toastUpdateSuccess, m.toastUpdateError],
		add: [m.toastAddLoading, m.toastAddSuccess, m.toastAddError],
		default: [m.toastLoading, m.toastSuccess, m.toastError]
	};

export function promiseToastStrings(targetName: string, action?: ToastAction) {
	const [loading, success, error] = TOAST_MESSAGES[action ?? 'default'];
	return {
		loading: loading({ targetName }),
		success: success({ targetName }),
		error: error({ targetName })
	};
}
