/** Pure helpers behind the attendance tabs. */

type Timestamp = string | Date;

type UserEvent = { present: boolean; conferenceUser?: { id: string } | null };

/** The latest event of each user, from events ordered newest first. */
export function latestEventByUser<E extends UserEvent>(events: readonly E[] | null | undefined) {
	const map = new Map<string, E>();
	for (const event of events ?? []) {
		const uid = event.conferenceUser?.id;
		if (uid && !map.has(uid)) map.set(uid, event);
	}
	return map;
}

/** Who is checked in where right now: each user's latest event, if it is a check-in. */
export function presentEventsByCommittee<E extends UserEvent & { committeeId: string }>(
	events: readonly E[] | null | undefined
) {
	const map = new Map<string, E[]>();
	for (const event of latestEventByUser(events).values()) {
		if (!event.present) continue;
		map.set(event.committeeId, [...(map.get(event.committeeId) ?? []), event]);
	}
	return map;
}

type Representation = { id?: string; name?: string | null; icon?: string | null };
type NsaUser = {
	id: string;
	name?: string | null;
	userEmail: string;
	conferenceMember?: { representation?: Representation | null } | null;
};

export type NsaOrg<U> = { orgId: string; name: string; icon: string | null; users: U[] };

/** NSA users grouped by their organisation, sorted by its name. */
export function groupNsaUsersByOrg<U extends NsaUser>({
	users,
	unknownName
}: {
	users: readonly U[] | null | undefined;
	unknownName: string;
}): NsaOrg<U>[] {
	const map = new Map<string, NsaOrg<U>>();
	for (const user of users ?? []) {
		const rep = user.conferenceMember?.representation;
		const orgId = rep?.id ?? '__unknown__';
		const entry = map.get(orgId) ?? {
			orgId,
			name: rep?.name ?? unknownName,
			icon: rep?.icon ?? null,
			users: []
		};
		entry.users.push(user);
		map.set(orgId, entry);
	}
	return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Quotes a CSV value when it holds a separator, quote or line break. */
export function csvEscape(value: string) {
	return /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Semicolon separated (Excel's German default) with \r\n line ends. */
export function toCsv(rows: readonly (readonly string[])[]) {
	return rows.map((row) => row.map(csvEscape).join(';')).join('\r\n') + '\r\n';
}

/** The NSA sheet: every NSA with the committee they are checked in to, if any. */
export function nsaSheetRows<U extends NsaUser>({
	orgs,
	latestByUser,
	committeeNames
}: {
	orgs: readonly NsaOrg<U>[];
	latestByUser: ReadonlyMap<string, { present: boolean; committeeId: string }>;
	committeeNames: ReadonlyMap<string, string>;
}) {
	const rows = [['id', 'name', 'email', 'organization', 'currently_in_committee']];
	for (const org of orgs) {
		for (const user of org.users) {
			const latest = latestByUser.get(user.id);
			const inCommittee = latest?.present ? (committeeNames.get(latest.committeeId) ?? '') : '';
			rows.push([user.id, user.name ?? '', user.userEmail, org.name, inCommittee]);
		}
	}
	return rows;
}

export function nsaSheetFileName({ title, date }: { title?: string | null; date: Date }) {
	const slug = (title ?? 'conference').toLowerCase().replace(/[^a-z0-9]+/g, '-');
	return `nsa-laufzettel-${slug}-${date.toISOString().slice(0, 10)}.csv`;
}

function nsaSortName(user: NsaUser) {
	return user.name ?? user.conferenceMember?.representation?.name ?? user.userEmail;
}

/** The NSAs not checked in anywhere, optionally only those who ever were. */
export function nsasNotCheckedIn<U extends NsaUser>({
	users,
	latestByUser,
	onlyWithHistory
}: {
	users: readonly U[] | null | undefined;
	latestByUser: ReadonlyMap<string, { present: boolean }>;
	onlyWithHistory: boolean;
}) {
	return (users ?? [])
		.filter((user) => {
			const latest = latestByUser.get(user.id);
			if (latest?.present) return false;
			return !onlyWithHistory || !!latest;
		})
		.sort((a, b) => nsaSortName(a).localeCompare(nsaSortName(b)));
}

type CommitteeWithMembers = {
	id: string;
	name: string;
	abbreviation?: string | null;
	members?:
		| {
				id: string;
				present: boolean;
				representation?: {
					name?: string | null;
					icon?: string | null;
					alpha3Code?: string | null;
					type?: string | null;
				} | null;
		  }[]
		| null;
};

type AbsentMember = {
	id: string;
	name: string;
	alpha3Code: string | null;
	icon: string | null;
};

function absentDelegates(committee: CommitteeWithMembers): AbsentMember[] {
	return (committee.members ?? [])
		.filter((mem) => mem.representation?.type === 'DELEGATION' && mem.present === false)
		.map((mem) => ({
			id: mem.id,
			name: mem.representation?.name ?? '',
			alpha3Code: mem.representation?.alpha3Code ?? null,
			icon: mem.representation?.icon ?? null
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/** The absent delegations of each committee, leaving out committees without any. */
export function absentDelegatesByCommittee(committees: readonly CommitteeWithMembers[]) {
	return committees
		.map((c) => ({
			committeeId: c.id,
			name: c.name,
			abbreviation: c.abbreviation ?? null,
			absent: absentDelegates(c)
		}))
		.filter((group) => group.absent.length > 0);
}

type CommitteeForStat = {
	totalPresent?: number | null;
	members?: { representation?: { type?: string | null } | null }[] | null;
};

/** Present delegations against all delegations of a committee. */
export function delegateStat(committee: CommitteeForStat) {
	const total = (committee.members ?? []).filter(
		(mem) => mem.representation?.type === 'DELEGATION'
	).length;
	return { present: committee.totalPresent ?? 0, total };
}

export function delegateTotals(committees: readonly CommitteeForStat[]) {
	let present = 0;
	let total = 0;
	for (const c of committees) {
		const stat = delegateStat(c);
		present += stat.present;
		total += stat.total;
	}
	return { present, total };
}

export function presenceBadgeClass({ present, total }: { present: number; total: number }) {
	if (total === 0 || present === 0) return 'badge-ghost';
	if (present === total) return 'badge-success';
	return 'badge-warning';
}

function timeOf(ts: Timestamp) {
	return ts instanceof Date ? ts.getTime() : new Date(ts).getTime();
}

/** Whole minutes and hours since a timestamp. */
export function elapsedSince({ ts, now }: { ts: Timestamp; now: number }) {
	const minutes = Math.floor((now - timeOf(ts)) / 60_000);
	return { minutes, hours: Math.floor(minutes / 60), restMinutes: minutes % 60 };
}

/** A check-in older than this is likely a forgotten checkout. */
export const STALE_CHECK_IN_HOURS = 4;

export function isStaleCheckIn({ ts, now }: { ts: Timestamp; now: number }) {
	return now - timeOf(ts) > STALE_CHECK_IN_HOURS * 60 * 60 * 1000;
}

/** A date as the value of an `<input type="datetime-local">`. */
export function toLocalInput(d: Date) {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type PresenceEventDraft = {
	conferenceUserId: string;
	committeeId: string;
	present: boolean;
	timestampLocal: string;
	note: string;
};

/** The editor's fields for an event, or for a new check-in now. */
export function presenceEventDraft({
	event,
	now
}: {
	event: {
		present: boolean;
		committeeId: string;
		conferenceUserId: string;
		timestamp: Timestamp;
		note?: string | null;
	} | null;
	now: Date;
}): PresenceEventDraft {
	if (!event) {
		return {
			conferenceUserId: '',
			committeeId: '',
			present: true,
			timestampLocal: toLocalInput(now),
			note: ''
		};
	}
	return {
		conferenceUserId: event.conferenceUserId,
		committeeId: event.committeeId,
		present: event.present,
		timestampLocal: toLocalInput(new Date(timeOf(event.timestamp))),
		note: event.note ?? ''
	};
}

export function isDraftComplete(draft: PresenceEventDraft) {
	return !!draft.conferenceUserId && !!draft.committeeId && !!draft.timestampLocal;
}
