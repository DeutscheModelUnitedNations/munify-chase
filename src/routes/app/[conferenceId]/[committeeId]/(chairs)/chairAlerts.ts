/** Which of the chairs' timer alerts have already been shown. */
export type AlertState = { status: boolean; speakersList: boolean; commentList: boolean };

export type ChairAlert = 'statusExpired' | 'listOvertime';

const LIST_FLAG = { SPEAKERS_LIST: 'speakersList', COMMENT_LIST: 'commentList' } as const;

function listFlag(type: string) {
	return type === 'SPEAKERS_LIST' || type === 'COMMENT_LIST' ? LIST_FLAG[type] : null;
}

/**
 * One tick of the alert timer: which alerts to show now and what has been shown. Each alert
 * fires once when its timer runs out and is rearmed when the timer has time again.
 */
export function alertTick({
	state,
	statusExpired,
	lists
}: {
	state: AlertState;
	statusExpired: boolean;
	lists: readonly { type: string; overtime: boolean }[];
}) {
	const next = { ...state, status: statusExpired };
	const alerts: ChairAlert[] = statusExpired && !state.status ? ['statusExpired'] : [];
	for (const list of lists) {
		const flag = listFlag(list.type);
		// XAND: only fire if both are false. Both true can be ignored, it should not happen.
		if (list.overtime && next.speakersList === next.commentList) {
			alerts.push('listOvertime');
			if (flag) next[flag] = true;
		} else if (!list.overtime && flag) {
			next[flag] = false;
		}
	}
	return { state: next, alerts };
}

/**
 * The toasts to open and close for the pending requests: one per request never seen before,
 * and closing those whose request is no longer pending.
 */
export function requestToastChanges<R extends { id: string }>({
	pending,
	notified,
	open
}: {
	pending: readonly R[];
	notified: ReadonlySet<string>;
	open: ReadonlyMap<string, string>;
}) {
	const pendingIds = new Set(pending.map((req) => req.id));
	return {
		show: pending.filter((req) => !notified.has(req.id)),
		dismiss: [...open].filter(([id]) => !pendingIds.has(id))
	};
}

/**
 * Whether a dock entry is the current page. The resolutions entry gives way to the
 * active draft's own entry while that draft is open.
 */
export function isDockItemActive({
	key,
	routeId,
	pathname,
	activeDraftResolutionId
}: {
	key: string;
	routeId: string | null;
	pathname: string;
	activeDraftResolutionId: string | null | undefined;
}) {
	if (!routeId?.includes(key)) return false;
	const onActiveDraft = !!activeDraftResolutionId && pathname.includes(activeDraftResolutionId);
	return !(key === 'resolutions' && onActiveDraft);
}
