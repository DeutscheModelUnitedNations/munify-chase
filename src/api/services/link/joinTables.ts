import type { MirrorSource } from './mirror';
import type { DelegatorWorkingPaper } from './workingPapers';

/**
 * DELEGATOR's tables of one conference as the link worker keeps them (`liveTable`), one row per
 * row there and only ids where rows point at each other, joined here into what `mirrorConference`
 * and the working papers take. Pure, so the join is unit tested.
 */

type Person = MirrorSource['teamMembers'][number]['user'];

export interface DelegatorTables {
	committees: readonly Omit<MirrorSource['committees'][number], 'agendaItems'>[];
	agendaItems: readonly { id: string; title: string; committeeId: string }[];
	roles: MirrorSource['roles'];
	teamMembers: readonly { id: string; role: string; userId: string }[];
	delegations: readonly { id: string; assignedRoleId?: string | null }[];
	delegationMembers: readonly {
		id: string;
		delegationId: string;
		conferenceParticipantId: string;
		assignedCommitteeId?: string | null;
	}[];
	singleParticipants: readonly {
		id: string;
		conferenceParticipantId: string;
		assignedRoleId?: string | null;
	}[];
	supervisors: readonly { id: string; conferenceParticipantId: string }[];
	participants: readonly { id: string; userId: string; nsaCardNumber: number }[];
	users: readonly Person[];
	papers: readonly {
		id: string;
		delegationId: string;
		agendaItemId?: string | null;
		/** Only the accepted versions: the link reads no others. */
		versions: readonly { id: string; version: number }[];
	}[];
}

/** Ids rows point at that their table does not hold (yet): asked for again before they count. */
interface MissingRows {
	users: string[];
	participants: string[];
	delegations: string[];
}

export function joinTables({
	conference,
	tables
}: {
	conference: MirrorSource['conference'];
	tables: DelegatorTables;
}) {
	const missing: MissingRows = { users: [], participants: [], delegations: [] };
	const byId = <T extends { id: string }>(rows: readonly T[]) =>
		new Map(rows.map((row) => [row.id, row]));
	const users = byId(tables.users);
	const participants = byId(tables.participants);
	const delegations = byId(tables.delegations);

	const userOf = (userId: string) => {
		const user = users.get(userId);
		if (!user) missing.users.push(userId);
		return user;
	};
	/** The person behind a registration, with their participant row. */
	const personOf = (participantId: string) => {
		const participant = participants.get(participantId);
		if (!participant) {
			missing.participants.push(participantId);
			return undefined;
		}
		const user = userOf(participant.userId);
		return user && { participant, user };
	};

	const agendaItemsOf = Map.groupBy(tables.agendaItems, (item) => item.committeeId);

	const source: MirrorSource = {
		conference,
		committees: tables.committees.map((committee) => ({
			...committee,
			agendaItems: (agendaItemsOf.get(committee.id) ?? []).map(({ id, title }) => ({ id, title }))
		})),
		roles: tables.roles,
		teamMembers: tables.teamMembers.flatMap((member) => {
			const user = userOf(member.userId);
			return user ? [{ id: member.id, role: member.role, user }] : [];
		}),
		supervisors: tables.supervisors.flatMap((supervisor) => {
			const person = personOf(supervisor.conferenceParticipantId);
			return person ? [{ id: supervisor.id, user: person.user }] : [];
		}),
		delegationMembers: tables.delegationMembers.flatMap((member) => {
			const delegation = delegations.get(member.delegationId);
			if (!delegation) missing.delegations.push(member.delegationId);
			const person = personOf(member.conferenceParticipantId);
			if (!delegation || !person) return [];
			return [
				{
					id: member.id,
					assignedCommittee: member.assignedCommitteeId ? { id: member.assignedCommitteeId } : null,
					delegation: {
						id: delegation.id,
						assignedRole: delegation.assignedRoleId ? { id: delegation.assignedRoleId } : null
					},
					participant: { nsaCardNumber: person.participant.nsaCardNumber },
					user: person.user
				}
			];
		}),
		singleParticipants: tables.singleParticipants.flatMap((single) => {
			// only the seated reach CHASE, and only theirs are asked for
			if (!single.assignedRoleId) return [];
			const person = personOf(single.conferenceParticipantId);
			if (!person) return [];
			return [
				{
					id: single.id,
					assignedRole: single.assignedRoleId ? { id: single.assignedRoleId } : null,
					user: person.user
				}
			];
		})
	};

	const agendaItems = byId(tables.agendaItems);
	const papers: DelegatorWorkingPaper[] = tables.papers.flatMap((paper) => {
		const delegation = delegations.get(paper.delegationId);
		// a paper of a delegation the link cannot read is no paper of a seated delegation
		if (!delegation) return [];
		const agendaItem = paper.agendaItemId ? agendaItems.get(paper.agendaItemId) : undefined;
		return [
			{
				id: paper.id,
				agendaItem: agendaItem && { id: agendaItem.id, committeeId: agendaItem.committeeId },
				delegation: { assignedRoleId: delegation.assignedRoleId },
				versions: paper.versions.map(({ id, version }) => ({ id, version }))
			}
		];
	});

	return {
		source,
		papers,
		missing: {
			users: [...new Set(missing.users)],
			participants: [...new Set(missing.participants)],
			delegations: [...new Set(missing.delegations)]
		}
	};
}
