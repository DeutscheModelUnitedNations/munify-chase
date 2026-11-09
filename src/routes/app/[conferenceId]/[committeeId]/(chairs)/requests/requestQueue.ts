import { m } from '#lib/paraglide/messages';

/** A request's time of day, as the queue and the history show it. */
export function formatRequestTime(ts: string | Date) {
	const d = ts instanceof Date ? ts : new Date(ts);
	return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** The badge a closed request carries in the history. */
export function historyStatusBadge(status: string | null | undefined) {
	return status === 'WITHDRAWN'
		? { badgeClass: 'badge-ghost', label: m.withdrawn() }
		: { badgeClass: 'badge-success', label: m.resolved() };
}
