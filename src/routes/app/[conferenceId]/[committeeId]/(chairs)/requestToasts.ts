import { requestToastChanges } from './chairAlerts';

/**
 * One pass of the chairs' per-request notifications: toasts for new pending requests,
 * dismissals for the ones resolved or withdrawn since. The first pass only notes what is
 * already pending, so opening a committee does not toast for older requests.
 * Returns whether that first pass has happened.
 */
export function syncRequestToasts<R extends { id: string }>({
	pending,
	notified,
	open,
	initialized,
	show,
	dismiss
}: {
	pending: readonly R[];
	/** Every request toasted for so far, so a dismissed toast never comes back */
	notified: Set<string>;
	/** The open toast of each request */
	open: Map<string, string>;
	initialized: boolean;
	show: (req: R) => void;
	dismiss: (toastId: string) => void;
}) {
	if (!initialized) {
		for (const req of pending) notified.add(req.id);
		return true;
	}
	const changes = requestToastChanges({ pending, notified, open });
	for (const req of changes.show) show(req);
	for (const [id, toastId] of changes.dismiss) {
		dismiss(toastId);
		open.delete(id);
	}
	return true;
}
