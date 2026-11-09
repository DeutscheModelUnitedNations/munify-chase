/** Pure helpers behind the conference members table and its edit dialog. */
import { m } from '#lib/paraglide/messages';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

export type RoleType = 'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR';

type Representation = {
	id: string;
	name: string | null;
	alpha2Code?: string | null;
	alpha3Code: string | null;
	icon: string | null;
};

export interface ConferenceUserRow {
	id: string;
	userEmail: string;
	name: string | null;
	conferenceUserType: string;
	user: { givenName: string; familyName: string } | null;
	committeeMember: {
		id: string;
		representation: Representation & { alpha2Code: string | null };
		committee: { id: string; name: string; abbreviation: string };
	} | null;
	conferenceMember: {
		id: string;
		representation: Representation & { type: string };
	} | null;
}

const ROLE_BADGE_CLASS: Record<string, string> = {
	ADMIN: 'badge-error',
	TEAM: 'badge-warning',
	DELEGATE: 'badge-primary',
	NON_STATE_ACTOR: 'badge-secondary',
	SPECTATOR: 'badge-ghost'
};

const ROLE_LABEL: Record<string, () => string> = {
	ADMIN: m.admin,
	TEAM: m.teamMember,
	DELEGATE: m.delegate,
	NON_STATE_ACTOR: m.nonStateActor,
	SPECTATOR: m.spectator
};

export function roleBadgeClass(role: string) {
	return ROLE_BADGE_CLASS[role] ?? 'badge-ghost';
}

export function roleLabel(role: string) {
	return ROLE_LABEL[role]?.() ?? role;
}

export type UserEditForm = {
	role: RoleType;
	committeeMemberId: string | null;
	conferenceMemberId: string | null;
	name: string;
};

export function isAssignableRole(role: string): boolean {
	return role === 'DELEGATE' || role === 'NON_STATE_ACTOR';
}

/** The representation a delegate or NSA is assigned to, if any. */
export function assignmentRepresentation(user: ConferenceUserRow) {
	if (user.conferenceUserType === 'DELEGATE') return user.committeeMember?.representation;
	if (user.conferenceUserType === 'NON_STATE_ACTOR') return user.conferenceMember?.representation;
	return undefined;
}

/** A representation's own name, else its country's. */
export function representationName(representation: {
	name: string | null;
	alpha3Code: string | null;
}) {
	return representation.name || getTranslatedCountryNameFromAlpha3Code(representation.alpha3Code);
}

/** The name an admin gave the member, else the one from their account. */
export function userDisplayName(user: Pick<ConferenceUserRow, 'name' | 'user'>): string {
	if (user.name) return user.name;
	return `${user.user?.givenName ?? ''} ${user.user?.familyName ?? ''}`.trim();
}

export function committeeText(user: ConferenceUserRow): string {
	return user.committeeMember?.committee?.abbreviation ?? '';
}

/** Whether any of the texts shown for a member contains the search. */
export function matchesSearch({ texts, search }: { texts: string[]; search: string }) {
	const needle = search.toLowerCase();
	return texts.some((text) => text.toLowerCase().includes(needle));
}

/** Page indices to show: all of up to seven, else the ends and the current one's neighbours. */
export function visiblePages({
	current,
	total
}: {
	current: number;
	total: number;
}): (number | 'ellipsis')[] {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i);
	const start = Math.max(1, current - 1);
	const end = Math.min(total - 2, current + 1);
	const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
	return [
		0,
		...(start > 1 ? ['ellipsis' as const] : []),
		...middle,
		...(end < total - 2 ? ['ellipsis' as const] : []),
		total - 1
	];
}

export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Valid addresses from a list separated by lines, commas or semicolons, lowercased. */
export function parseEmails(input: string): string[] {
	return input
		.split(/[\n,;]+/)
		.map((email) => email.trim().toLowerCase())
		.filter((email) => email.length > 0 && isValidEmail(email));
}

/** How many members are assigned to each seat. */
export function assignmentCounts(ids: readonly (string | null | undefined)[]) {
	const counts = new Map<string, number>();
	for (const id of ids) {
		if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
	}
	return counts;
}

/** Drops the assignment the chosen role does not use. */
export function withRoleAssignment(form: UserEditForm): UserEditForm {
	return {
		...form,
		committeeMemberId: form.role === 'DELEGATE' ? form.committeeMemberId : null,
		conferenceMemberId: form.role === 'NON_STATE_ACTOR' ? form.conferenceMemberId : null
	};
}

/** What the edit dialog saves: only the assignment the role uses. */
export function userEditResult(form: UserEditForm) {
	const { role, committeeMemberId, conferenceMemberId, name } = withRoleAssignment(form);
	return { conferenceUserType: role, committeeMemberId, conferenceMemberId, name: name.trim() || null };
}

/** The edit dialog's fields for a member. */
export function userEditForm(user: {
	conferenceUserType: string;
	name: string | null;
	committeeMember: { id: string } | null;
	conferenceMember: { id: string } | null;
}): UserEditForm {
	return {
		// TYPE-SAFETY-EXCEPTION: the generated client types the role column as a plain string
		role: user.conferenceUserType as RoleType,
		committeeMemberId: user.committeeMember?.id ?? null,
		conferenceMemberId: user.conferenceMember?.id ?? null,
		name: user.name ?? ''
	};
}

/** A seat in the dialog's picker, with how many members already hold it. */
export function seatOptionLabel({
	representation,
	assigned
}: {
	representation: { name: string | null; alpha3Code: string | null };
	assigned: number;
}) {
	const name = representationName(representation);
	return assigned > 0 ? `${name} (${m.assignedCount({ count: assigned })})` : name;
}
