import { getCountryData } from '#api/db/seedUtils';

/**
 * What CHASE keeps of a DELEGATOR conference (`docs/plans/delegator-link.md`), worked out from what
 * the link worker read. Pure, so the mapping is unit tested; every id is DELEGATOR's, or derived
 * from DELEGATOR's, so a second sync finds the rows of the first.
 */

interface Person {
	id: string;
	email: string;
	givenName: string;
	familyName: string;
}

type RoleKind = 'NATION' | 'NON_STATE_ACTOR' | 'CUSTOM';
type ChaseAccess = 'SPECTATOR' | 'TEAM' | 'NONE';

export interface MirrorSource {
	conference: {
		id: string;
		title: string;
		location?: string | null;
		startConference: Date;
		endConference: Date;
	};
	committees: readonly {
		id: string;
		name: string;
		abbreviation: string;
		agendaItems: readonly { id: string; title: string }[];
		/** The nations the committee seats. */
		roles: readonly { id: string }[];
	}[];
	roles: readonly {
		id: string;
		kind: RoleKind;
		name?: string | null;
		fontAwesomeIcon?: string | null;
		chaseAccess: ChaseAccess;
		nation?: { alpha2Code: string } | null;
	}[];
	teamMembers: readonly { id: string; role: string; user: Person }[];
	supervisors: readonly { id: string; user: Person }[];
	delegationMembers: readonly {
		id: string;
		assignedCommittee?: { id: string } | null;
		delegation: { id: string; assignedRole?: { id: string } | null };
		/** The number of the member's current NSA card. */
		participant?: { nsaCardNumber: number } | null;
		user: Person;
	}[];
	singleParticipants: readonly {
		id: string;
		assignedRole?: { id: string } | null;
		user: Person;
	}[];
}

/** The DELEGATOR team roles that run a conference in CHASE; the rest of the team is `TEAM`. */
const ADMIN_TEAM_ROLES = new Set(['PROJECT_MANAGEMENT', 'TEAM_COORDINATOR']);

/** A nation's seat in a committee: one CHASE committee member, shared by its delegates there. */
export function committeeMemberId({
	roleId,
	committeeId
}: {
	roleId: string;
	committeeId: string;
}) {
	return `${roleId}_${committeeId}`;
}

function nameOf(person: Person) {
	const name = `${person.givenName} ${person.familyName}`.trim();
	return name.length > 0 ? name : null;
}

type ConferenceUserType = 'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR';

interface MirroredUser {
	id: string;
	conferenceUserType: ConferenceUserType;
	userEmail: string;
	name: string | null;
	delegatorUserId: string;
	conferenceMemberId: string | null;
	committeeMemberId: string | null;
	cardNumber: number;
}

interface MirroredRepresentation {
	id: string;
	type: 'DELEGATION' | 'NSA';
	alpha2Code: string | null;
	alpha3Code: string | null;
	regionalGroup: ReturnType<typeof getCountryData>['regionalGroup'] | null;
	name: string | null;
	faIcon: string | null;
}

export function mirrorConference(source: MirrorSource) {
	const conferenceId = source.conference.id;
	const roleById = new Map(source.roles.map((role) => [role.id, role]));

	const representations = source.roles.flatMap((role): MirroredRepresentation[] => {
		if (role.kind === 'NATION') {
			const seated = source.committees.some((c) => c.roles.some((r) => r.id === role.id));
			if (!seated || !role.nation) return [];
			const country = countryOf(role.nation.alpha2Code);
			if (!country) return [];
			return [
				{
					id: role.id,
					type: 'DELEGATION',
					alpha2Code: country.alpha2Code,
					alpha3Code: country.alpha3Code,
					regionalGroup: country.regionalGroup ?? null,
					name: null,
					faIcon: null
				}
			];
		}
		if (role.kind === 'NON_STATE_ACTOR') {
			return [
				{
					id: role.id,
					type: 'NSA',
					alpha2Code: null,
					alpha3Code: null,
					regionalGroup: null,
					name: role.name ?? null,
					faIcon: role.fontAwesomeIcon ?? null
				}
			];
		}
		return [];
	});
	const representationIds = new Set(representations.map((r) => r.id));

	const committeeMembers = source.committees.flatMap((committee) =>
		committee.roles
			.filter((role) => representationIds.has(role.id))
			.map((role) => ({
				id: committeeMemberId({ roleId: role.id, committeeId: committee.id }),
				committeeId: committee.id,
				representationId: role.id
			}))
	);
	const committeeMemberIds = new Set(committeeMembers.map((m) => m.id));

	const nsaMembers = source.delegationMembers.filter((member) => {
		const role = member.delegation.assignedRole && roleById.get(member.delegation.assignedRole.id);
		return role?.kind === 'NON_STATE_ACTOR' && representationIds.has(role.id);
	});
	const conferenceMembers = uniqueBy(
		nsaMembers.map((member) => ({
			id: member.delegation.id,
			representationId: member.delegation.assignedRole?.id ?? ''
		})),
		(row) => row.id
	);

	const user = (
		person: Person,
		row: Omit<MirroredUser, 'userEmail' | 'name' | 'delegatorUserId' | 'cardNumber'> & {
			cardNumber?: number;
		}
	): MirroredUser => ({
		cardNumber: 1,
		...row,
		userEmail: person.email.toLowerCase(),
		name: nameOf(person),
		delegatorUserId: person.id
	});

	const users: MirroredUser[] = [
		...source.teamMembers.map((member) =>
			user(member.user, {
				id: member.id,
				conferenceUserType: ADMIN_TEAM_ROLES.has(member.role) ? 'ADMIN' : 'TEAM',
				conferenceMemberId: null,
				committeeMemberId: null
			})
		),
		...source.supervisors.map((supervisor) =>
			user(supervisor.user, {
				id: supervisor.id,
				conferenceUserType: 'SPECTATOR',
				conferenceMemberId: null,
				committeeMemberId: null
			})
		),
		...nsaMembers.map((member) =>
			user(member.user, {
				id: member.id,
				conferenceUserType: 'NON_STATE_ACTOR',
				conferenceMemberId: member.delegation.id,
				committeeMemberId: null,
				cardNumber: member.participant?.nsaCardNumber ?? 1
			})
		),
		...source.delegationMembers.flatMap((member) => {
			const roleId = member.delegation.assignedRole?.id;
			const committeeId = member.assignedCommittee?.id;
			if (!roleId || !committeeId) return [];
			const seat = committeeMemberId({ roleId, committeeId });
			if (!committeeMemberIds.has(seat)) return [];
			return [
				user(member.user, {
					id: member.id,
					conferenceUserType: 'DELEGATE',
					conferenceMemberId: null,
					committeeMemberId: seat
				})
			];
		}),
		...source.singleParticipants.flatMap((participant) => {
			const role = participant.assignedRole && roleById.get(participant.assignedRole.id);
			if (!role || role.chaseAccess === 'NONE') return [];
			return [
				user(participant.user, {
					id: participant.id,
					conferenceUserType: role.chaseAccess === 'TEAM' ? 'TEAM' : 'SPECTATOR',
					conferenceMemberId: null,
					committeeMemberId: null
				})
			];
		})
	];

	return {
		conference: {
			id: conferenceId,
			title: source.conference.title,
			location: source.conference.location ?? null,
			startDate: source.conference.startConference,
			endDate: source.conference.endConference
		},
		committees: source.committees.map((committee) => ({
			id: committee.id,
			name: committee.name,
			abbreviation: committee.abbreviation
		})),
		agendaItems: source.committees.flatMap((committee) =>
			committee.agendaItems.map((item) => ({
				id: item.id,
				committeeId: committee.id,
				title: item.title
			}))
		),
		representations,
		committeeMembers,
		conferenceMembers,
		// a conference has each address once; DELEGATOR's one-part rule makes doubles impossible
		conferenceUsers: uniqueBy(users, (row) => row.userEmail)
	};
}

export type Mirror = ReturnType<typeof mirrorConference>;

function countryOf(alpha2Code: string) {
	try {
		return getCountryData(alpha2Code);
	} catch {
		return undefined;
	}
}

function uniqueBy<T>(rows: T[], key: (row: T) => string) {
	const seen = new Set<string>();
	return rows.filter((row) => {
		const k = key(row);
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
}
