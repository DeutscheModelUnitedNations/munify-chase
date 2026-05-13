import type { ConferenceusertypeEnum } from '$lib/api/rumbleClient/client';

export type LauncherStatus = 'upcoming' | 'active' | 'past';
export type LauncherBadge = 'ADMIN' | 'CHAIR' | 'DELEGATE' | 'SPECTATOR';

export function deriveStatus(
	c: { startDate?: string | null; endDate?: string | null },
	now: Date = new Date()
): LauncherStatus {
	if (!c.startDate || !c.endDate) return 'upcoming';
	const start = new Date(c.startDate);
	const end = new Date(c.endDate);
	end.setHours(23, 59, 59, 999);
	if (now < start) return 'upcoming';
	if (now > end) return 'past';
	return 'active';
}

export function badgeFor(type: ConferenceusertypeEnum): LauncherBadge {
	switch (type) {
		case 'ADMIN':
			return 'ADMIN';
		case 'TEAM':
			return 'CHAIR';
		case 'SPECTATOR':
			return 'SPECTATOR';
		case 'DELEGATE':
		case 'NON_STATE_ACTOR':
		default:
			return 'DELEGATE';
	}
}

function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

export function formatDateRange(
	c: { startDate?: string | null; endDate?: string | null },
	locale: string
): string {
	if (!c.startDate || !c.endDate) return '';
	const s = new Date(c.startDate);
	const e = new Date(c.endDate);
	if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '';

	const monthFmt = new Intl.DateTimeFormat(locale, { month: 'short' });
	const sMonth = monthFmt.format(s);
	const eMonth = monthFmt.format(e);
	const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
	const sameYear = s.getFullYear() === e.getFullYear();

	if (sameMonth) {
		return `${pad2(s.getDate())}.–${pad2(e.getDate())}. ${eMonth} ${e.getFullYear()}`;
	}
	if (sameYear) {
		return `${pad2(s.getDate())}. ${sMonth} – ${pad2(e.getDate())}. ${eMonth} ${e.getFullYear()}`;
	}
	return `${pad2(s.getDate())}. ${sMonth} ${s.getFullYear()} – ${pad2(e.getDate())}. ${eMonth} ${e.getFullYear()}`;
}
