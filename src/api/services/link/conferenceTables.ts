import type { DelegatorClient } from './delegatorRemote';
import type { DelegatorTables } from './joinTables';
import { liveTable, type Gate, type LiveResult } from './liveTable';

/**
 * Watches the DELEGATOR tables one conference's mirror is made of (`docs/plans/delegator-link.md`),
 * each with its own live queries (`liveTable`): a change answers with the rows of the one table it
 * touched, and nothing is read again. Rows point at each other by id; `joinTables` puts them
 * together.
 */
export function watchConferenceTables({
	remote,
	conferenceId,
	onChange,
	onError,
	gate
}: {
	remote: DelegatorClient;
	conferenceId: string;
	onChange: () => void;
	onError: (error: unknown) => void;
	gate: Gate;
}) {
	type PageArgs = { limit: number; offset: number; orderBy: { id: 'asc' } };
	/**
	 * One table: its rows of the conference (`where`, asked anew on every refresh), a page at a time,
	 * and some by id.
	 */
	const table = <Row extends { id: string }, Where>({
		where,
		live,
		read
	}: {
		where: () => Where;
		live: (args: PageArgs & { where: Where }) => LiveResult<readonly Row[] | null | undefined>;
		read: (args: { where: Where & { id: { in: string[] } } }) => PromiseLike<readonly Row[]>;
	}) =>
		liveTable<Row>({
			watchPage: (page) => live({ ...page, where: where() }),
			readIds: (ids) => read({ where: { ...where(), id: { in: ids } } }),
			onChange: () => changed(),
			onError,
			gate
		});

	const inConference = { conferenceId: { eq: conferenceId } };
	const ofConference = { conference: { id: { eq: conferenceId } } };
	// Only the seated reach CHASE, and a released conference holds many more applications than
	// seats, so the members are asked for those of seated delegations only. A list hears changes to
	// the rows it shows, not of a row coming into it: the members are asked again whenever the
	// seats change, which the delegations, watched whole like the single participants, tell. The participant rows and the users
	// are asked for by id, the ones the other tables name (`changed`), which spares DELEGATOR
	// looking for them among everybody.
	const seated = { assignedRoleId: { isNotNull: true } };
	let participantIds: string[] = [];
	let userIds: string[] = [];

	const COMMITTEE = { id: true, name: true, abbreviation: true, roles: { id: true } } as const;
	const AGENDA_ITEM = { id: true, title: true, committeeId: true } as const;
	const ROLE = {
		id: true,
		kind: true,
		name: true,
		fontAwesomeIcon: true,
		chaseAccess: true,
		nation: { alpha2Code: true }
	} as const;
	const TEAM_MEMBER = { id: true, role: true, userId: true } as const;
	const DELEGATION = { id: true, assignedRoleId: true } as const;
	const DELEGATION_MEMBER = {
		id: true,
		delegationId: true,
		conferenceParticipantId: true,
		assignedCommitteeId: true
	} as const;
	const SINGLE_PARTICIPANT = {
		id: true,
		conferenceParticipantId: true,
		assignedRoleId: true
	} as const;
	const SUPERVISOR = { id: true, conferenceParticipantId: true } as const;
	const PARTICIPANT = { id: true, userId: true, nsaCardNumber: true } as const;
	const USER = { id: true, email: true, givenName: true, familyName: true } as const;
	const PAPER = {
		id: true,
		delegationId: true,
		agendaItemId: true,
		versions: { id: true, version: true }
	} as const;

	const tables = {
		committees: table({
			where: () => inConference,
			live: (args) => remote.liveQuery.committees({ __args: args, ...COMMITTEE }),
			read: (args) => remote.query.committees({ __args: args, ...COMMITTEE })
		}),
		agendaItems: table({
			where: () => ({ committee: inConference }),
			live: (args) => remote.liveQuery.committeeAgendaItems({ __args: args, ...AGENDA_ITEM }),
			read: (args) => remote.query.committeeAgendaItems({ __args: args, ...AGENDA_ITEM })
		}),
		roles: table({
			where: () => inConference,
			live: (args) => remote.liveQuery.conferenceRoles({ __args: args, ...ROLE }),
			read: (args) => remote.query.conferenceRoles({ __args: args, ...ROLE })
		}),
		teamMembers: table({
			where: () => inConference,
			live: (args) => remote.liveQuery.teamMembers({ __args: args, ...TEAM_MEMBER }),
			read: (args) => remote.query.teamMembers({ __args: args, ...TEAM_MEMBER })
		}),
		delegations: table({
			where: () => inConference,
			live: (args) => remote.liveQuery.delegations({ __args: args, ...DELEGATION }),
			read: (args) => remote.query.delegations({ __args: args, ...DELEGATION })
		}),
		delegationMembers: table({
			where: () => ({ ...ofConference, delegation: seated }),
			live: (args) => remote.liveQuery.delegationMembers({ __args: args, ...DELEGATION_MEMBER }),
			read: (args) => remote.query.delegationMembers({ __args: args, ...DELEGATION_MEMBER })
		}),
		singleParticipants: table({
			where: () => ofConference,
			live: (args) => remote.liveQuery.singleParticipants({ __args: args, ...SINGLE_PARTICIPANT }),
			read: (args) => remote.query.singleParticipants({ __args: args, ...SINGLE_PARTICIPANT })
		}),
		supervisors: table({
			where: () => ofConference,
			live: (args) => remote.liveQuery.conferenceSupervisors({ __args: args, ...SUPERVISOR }),
			read: (args) => remote.query.conferenceSupervisors({ __args: args, ...SUPERVISOR })
		}),
		participants: table({
			where: () => ({ ...inConference, id: { in: participantIds } }),
			live: (args) => remote.liveQuery.conferenceParticipants({ __args: args, ...PARTICIPANT }),
			read: (args) => remote.query.conferenceParticipants({ __args: args, ...PARTICIPANT })
		}),
		users: table({
			where: () => ({ id: { in: userIds } }),
			live: (args) => remote.liveQuery.users({ __args: args, ...USER }),
			read: (args) => remote.query.users({ __args: args, ...USER })
		}),
		// the accepted working papers; a newly accepted version is announced on its paper
		papers: table({
			where: () => ({ type: 'WORKING_PAPER' as const, delegation: inConference }),
			live: (args) => remote.liveQuery.papers({ __args: args, ...PAPER }),
			read: (args) => remote.query.papers({ __args: args, ...PAPER })
		})
	};
	type Name = keyof typeof tables;
	const all = Object.values(tables);

	/** The seated delegations, as last seen. */
	let seats: string | undefined;
	const sameIds = (a: readonly string[], b: readonly string[]) =>
		a.length === b.length && a.every((id, i) => id === b[i]);
	const idsOf = (values: Iterable<string>) => [...new Set(values)].sort();

	/** After any table changed: asks the tables that follow from it again, when what they follow changed. */
	function changed() {
		const { delegations, delegationMembers, singleParticipants, supervisors, participants } =
			tables;
		if (delegations.ready()) {
			const now = delegations
				.rows()
				.filter((row) => row.assignedRoleId)
				.map((row) => `${row.id}:${row.assignedRoleId}`)
				.sort()
				.join(',');
			if (seats !== undefined && seats !== now) delegationMembers.refresh();
			seats = now;
		}
		if (delegationMembers.ready() && singleParticipants.ready() && supervisors.ready()) {
			const now = idsOf(
				[
					...delegationMembers.rows(),
					...singleParticipants.rows().filter((row) => row.assignedRoleId),
					...supervisors.rows()
				].map((row) => row.conferenceParticipantId)
			);
			if (!sameIds(now, participantIds)) {
				participantIds = now;
				participants.refresh();
			}
		}
		if (participants.ready() && tables.teamMembers.ready()) {
			const now = idsOf(
				[...participants.rows(), ...tables.teamMembers.rows()].map((row) => row.userId)
			);
			if (!sameIds(now, userIds)) {
				userIds = now;
				tables.users.refresh();
			}
		}
		onChange();
	}

	return {
		/** Every table answered: only then may the mirror take what they hold for all there is. */
		ready: () => all.every((t) => t.ready()),
		tables: (): DelegatorTables => ({
			committees: tables.committees.rows(),
			agendaItems: tables.agendaItems.rows(),
			roles: tables.roles.rows(),
			teamMembers: tables.teamMembers.rows(),
			delegations: tables.delegations.rows(),
			delegationMembers: tables.delegationMembers.rows(),
			singleParticipants: tables.singleParticipants.rows(),
			supervisors: tables.supervisors.rows(),
			participants: tables.participants.rows(),
			users: tables.users.rows(),
			papers: tables.papers.rows()
		}),
		/** Asks the given tables (all, without any) again from scratch. */
		refresh: (names?: readonly Name[]) => {
			for (const t of names ? names.map((name) => tables[name]) : all) t.refresh();
		},
		stop: () => {
			for (const t of all) t.stop();
		}
	};
}

export type ConferenceTables = ReturnType<typeof watchConferenceTables>;
