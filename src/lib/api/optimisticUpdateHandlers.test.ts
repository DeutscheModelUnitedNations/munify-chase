import { createRequest, gql, makeOperation, type Client, type Operation } from '@urql/core';
import { cacheExchange, type Cache, type Variables } from '@urql/exchange-graphcache';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeSubject, map, pipe, subscribe } from 'wonka';

vi.mock('#lib/state/serverClock.svelte', () => ({
	getServerTime: () => dayjs('2026-01-01T12:00:00.000Z')
}));

import { optimistic, updates } from './optimisticUpdateHandlers';

const NOW = new Date('2026-01-01T12:00:00.000Z');

// ---------------------------------------------------------------------------
// A real graphcache Store, reached through an updater: graphcache only lets the cache be
// read and written while it processes an operation, so every `run` sends a no-op mutation
// whose updater hands the cache to the callback.
// ---------------------------------------------------------------------------

type Run = <T>(fn: (cache: Cache) => T) => T;

function makeCacheRunner(): Run {
	let current: (cache: Cache) => void = () => {};
	const { source, next } = makeSubject<Operation>();
	const exchange = cacheExchange({
		updates: { Mutation: { __run: (_result, _args, cache) => current(cache) } }
	});
	const forward = (ops$: typeof source) =>
		pipe(
			ops$,
			map((operation) => ({
				operation,
				data: { __run: true },
				stale: false,
				hasNext: false
			}))
		);
	const client = { reexecuteOperation: vi.fn() } as unknown as Client;
	pipe(
		exchange({ forward, client, dispatchDebug: vi.fn() })(source),
		subscribe(() => {})
	);
	let key = 0;
	return <T>(fn: (cache: Cache) => T): T => {
		let out: T | undefined;
		current = (cache) => {
			out = fn(cache);
		};
		const request = { ...createRequest(gql('mutation { __run }'), {}), key: ++key };
		next(makeOperation('mutation', request, { url: '/graphql', requestPolicy: 'network-only' }));
		return out as T;
	};
}

type Data = Record<string, unknown>;

/** A selection set covering every field of `data`, nested objects included */
function selectionOf(data: Data): string {
	return Object.entries(data)
		.map(([field, value]) => {
			// An empty list is a list of entities here, seeds hold no scalar lists
			if (Array.isArray(value) && value.length === 0) return `${field} { id }`;
			const sample = Array.isArray(value) ? value[0] : value;
			if (sample && typeof sample === 'object' && !(sample instanceof Date)) {
				const merged = Array.isArray(value) ? Object.assign({}, ...(value as Data[])) : sample;
				return `${field} { ${selectionOf(merged as Data)} }`;
			}
			return field;
		})
		.join(' ');
}

/** Writes `data` (with a __typename and id) to the cache, every field it names */
function seed(cache: Cache, data: Data & { __typename: string }) {
	cache.writeFragment(
		gql(`fragment Seed on ${data.__typename} { ${selectionOf(data)} }`),
		data as Data
	);
}

const info = {} as never;
const field = (cache: Cache, typename: string, id: string, name: string, args?: Variables) =>
	cache.resolve({ __typename: typename, id }, name, args);

let run: Run;
beforeEach(() => {
	run = makeCacheRunner();
});

// ---------------------------------------------------------------------------
// Seeds
// ---------------------------------------------------------------------------

const ref = (__typename: string, id: string) => ({ __typename, id });
const representation = (id: string) => ({
	__typename: 'Representation',
	id,
	name: `Rep ${id}`,
	alpha2Code: 'de',
	alpha3Code: 'deu',
	icon: null,
	type: 'DELEGATION'
});

type SpeakerSeed = {
	id: string;
	position: number;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
};

function seedSpeakersList(
	cache: Cache,
	{
		id = 'sl1',
		isClosed = false,
		allow = true,
		conferenceId = 'conf1' as string | null,
		speakers = [] as SpeakerSeed[]
	} = {}
) {
	seed(cache, {
		__typename: 'Speakerslist',
		id,
		isClosed,
		phase: 'SPEECH',
		timeLeft: 60,
		startTimestamp: null,
		agendaItem: {
			__typename: 'Agendaitem',
			id: `a-${id}`,
			committee: {
				__typename: 'Committee',
				id: `c-${id}`,
				allowDelegationsToAddThemselvesToSpeakersList: allow,
				conferenceId
			}
		},
		speakers: speakers.map((s) => ({
			__typename: 'Speakeronlist',
			committeeMemberId: null,
			conferenceMemberId: null,
			...s,
			speakersListId: id
		}))
	});
}

/** The list's entries as `id@position`, in link order */
function speakersOf(cache: Cache, id = 'sl1') {
	const keys = field(cache, 'Speakerslist', id, 'speakers') as string[];
	return keys.map((key) => {
		const speakerId = key.slice('Speakeronlist:'.length);
		return `${speakerId}@${field(cache, 'Speakeronlist', speakerId, 'position')}`;
	});
}

let rootUsers: string[] = [];
beforeEach(() => {
	rootUsers = [];
});

/** A conference user row, linked from a root Query field so it can be found as "self" */
function seedConferenceUser(
	cache: Cache,
	{
		id = 'cu1',
		conferenceUserType = 'DELEGATE',
		committeeMemberId = 'm1' as string | null,
		conferenceMemberId = null as string | null,
		conferenceId = 'conf1',
		userEmail = 'me@example.org' as string | null
	} = {}
) {
	seed(cache, {
		__typename: 'Conferenceuser',
		id,
		conferenceId,
		conferenceUserType,
		committeeMemberId,
		conferenceMemberId,
		userEmail
	});
	rootUsers.push(`Conferenceuser:${id}`);
	cache.link('Query', 'findManyConferenceUsers', rootUsers);
}

/** Query fields that are not conference users, which the self lookup must skip */
function seedUnrelatedRootFields(cache: Cache) {
	cache.link('Query', 'findFirstCommittee', 'Committee:c1');
	cache.link('Query', 'findFirstConferenceUser', null);
	cache.updateQuery({ query: gql('{ serverTime }') }, () => ({ serverTime: 5 }) as never);
}

// ---------------------------------------------------------------------------
// conferenceUser
// ---------------------------------------------------------------------------

describe('optimistic.updateConferenceUser', () => {
	const update = (args: Variables) =>
		optimistic.updateConferenceUser!(args, null as never, info) as Data;

	it('trims the name, clearing a blank one, and leaves a missing one alone', () => {
		expect(update({ id: 'u', conferenceUserType: 'CHAIR', name: '  Ada ' }).name).toBe('Ada');
		expect(update({ id: 'u', conferenceUserType: 'CHAIR', name: '   ' }).name).toBeNull();
		expect(update({ id: 'u', conferenceUserType: 'CHAIR', name: null })).not.toHaveProperty('name');
		expect(update({ id: 'u', conferenceUserType: 'CHAIR' })).not.toHaveProperty('name');
	});

	it('clears both member links for a role without one', () => {
		expect(update({ id: 'u', conferenceUserType: 'CHAIR', committeeMemberId: 'm1' })).toEqual({
			__typename: 'Conferenceuser',
			id: 'u',
			conferenceUserType: 'CHAIR',
			committeeMemberId: null,
			committeeMember: null,
			conferenceMemberId: null,
			conferenceMember: null
		});
	});

	it('links a delegate to the given committee member, or unlinks them', () => {
		const linked = update({ id: 'u', conferenceUserType: 'DELEGATE', committeeMemberId: 'm1' });
		expect(linked).toMatchObject({
			committeeMemberId: 'm1',
			committeeMember: ref('Committeemember', 'm1'),
			conferenceMemberId: null,
			conferenceMember: null
		});
		const unlinked = update({ id: 'u', conferenceUserType: 'DELEGATE', committeeMemberId: null });
		expect(unlinked).toMatchObject({ committeeMemberId: null, committeeMember: null });
		const untouched = update({ id: 'u', conferenceUserType: 'DELEGATE' });
		expect(untouched).not.toHaveProperty('committeeMemberId');
		expect(untouched).not.toHaveProperty('committeeMember');
	});

	it('links a non-state actor to the given conference member, or unlinks them', () => {
		const linked = update({
			id: 'u',
			conferenceUserType: 'NON_STATE_ACTOR',
			conferenceMemberId: 'cm1'
		});
		expect(linked).toMatchObject({
			conferenceMemberId: 'cm1',
			conferenceMember: ref('Conferencemember', 'cm1'),
			committeeMemberId: null,
			committeeMember: null
		});
		const unlinked = update({
			id: 'u',
			conferenceUserType: 'NON_STATE_ACTOR',
			conferenceMemberId: null
		});
		expect(unlinked).toMatchObject({ conferenceMemberId: null, conferenceMember: null });
		expect(update({ id: 'u', conferenceUserType: 'NON_STATE_ACTOR' })).not.toHaveProperty(
			'conferenceMember'
		);
	});
});

// ---------------------------------------------------------------------------
// presenceEvent
// ---------------------------------------------------------------------------

describe('presence events', () => {
	it('inserts an event and mirrors the check-in onto a cached user', () => {
		const event = run((cache) => {
			seed(cache, { __typename: 'Conferenceuser', id: 'u1' });
			return optimistic.insertPresenceEvent!(
				{
					id: 'e1',
					conferenceUserId: 'u1',
					committeeId: 'c1',
					present: true,
					timestamp: '2026-01-01T10:00:00.000Z',
					markerType: 'ROLL_CALL',
					note: 'late'
				},
				cache,
				info
			);
		});
		expect(event).toMatchObject({
			id: 'e1',
			conferenceUserId: 'u1',
			present: true,
			type: 'ROLL_CALL',
			note: 'late',
			timestamp: new Date('2026-01-01T10:00:00.000Z')
		});
		run((cache) => {
			expect(field(cache, 'Conferenceuser', 'u1', 'isCheckedIn')).toBe(true);
			expect(field(cache, 'Conferenceuser', 'u1', 'currentCommitteeId')).toBe('c1');
			expect(field(cache, 'Conferenceuser', 'u1', 'currentCheckedInSince')).toEqual(
				new Date('2026-01-01T10:00:00.000Z')
			);
		});
	});

	it('checks a cached user out, and leaves an uncached one alone', () => {
		run((cache) => {
			seed(cache, { __typename: 'Conferenceuser', id: 'u1' });
			optimistic.insertPresenceEvent!(
				{ id: 'e1', conferenceUserId: 'u1', committeeId: 'c1', present: false },
				cache,
				info
			);
			expect(field(cache, 'Conferenceuser', 'u1', 'isCheckedIn')).toBe(false);
			expect(field(cache, 'Conferenceuser', 'u1', 'currentCommitteeId')).toBeNull();
			expect(field(cache, 'Conferenceuser', 'u1', 'currentCheckedInSince')).toBeNull();

			const event = optimistic.insertPresenceEvent!(
				{ id: 'e2', conferenceUserId: 'u2', committeeId: 'c1', present: true },
				cache,
				info
			);
			expect(event).toMatchObject({ type: 'MANUAL', note: null, timestamp: NOW });
			expect(field(cache, 'Conferenceuser', 'u2', 'isCheckedIn')).toBeUndefined();
		});
	});

	it('updates only the fields given', () => {
		const update = (args: Variables) => optimistic.updatePresenceEvent!(args, null as never, info);
		expect(
			update({
				id: 'e1',
				present: true,
				committeeId: 'c2',
				timestamp: '2026-01-01T09:00:00.000Z',
				note: null
			})
		).toEqual({
			__typename: 'Presenceevent',
			id: 'e1',
			present: true,
			committeeId: 'c2',
			committee: ref('Committee', 'c2'),
			timestamp: new Date('2026-01-01T09:00:00.000Z'),
			note: null
		});
		expect(update({ id: 'e1', note: 'x' })).toEqual({
			__typename: 'Presenceevent',
			id: 'e1',
			note: 'x'
		});
		expect(update({ id: 'e1' })).toEqual({ __typename: 'Presenceevent', id: 'e1' });
	});

	it('answers a delete with the cached event, else a placeholder', () => {
		run((cache) => {
			seed(cache, {
				__typename: 'Presenceevent',
				id: 'e1',
				conferenceUserId: 'u1',
				committeeId: 'c1',
				present: true,
				type: 'NSA_SCAN',
				timestamp: '2026-01-01T08:00:00.000Z',
				note: null
			});
			expect(optimistic.deletePresenceEvent!({ id: 'e1' }, cache, info)).toEqual({
				__typename: 'Presenceevent',
				id: 'e1',
				conferenceUserId: 'u1',
				committeeId: 'c1',
				present: true,
				type: 'NSA_SCAN',
				timestamp: new Date('2026-01-01T08:00:00.000Z'),
				note: null,
				rollCallSessionId: null,
				rollCallSession: null,
				triggeredBy: null,
				conferenceUser: ref('Conferenceuser', 'u1'),
				committee: ref('Committee', 'c1')
			});
			expect(optimistic.deletePresenceEvent!({ id: 'e9' }, cache, info)).toEqual({
				__typename: 'Presenceevent',
				id: 'e9',
				conferenceUserId: 'unknown',
				committeeId: 'unknown',
				present: false,
				type: 'MANUAL',
				timestamp: NOW,
				note: null,
				rollCallSessionId: null,
				rollCallSession: null,
				triggeredBy: null,
				conferenceUser: ref('Conferenceuser', 'unknown'),
				committee: ref('Committee', 'unknown')
			});
		});
	});

	function seedEventLists(cache: Cache) {
		seed(cache, {
			__typename: 'Presenceevent',
			id: 'e1',
			conferenceUserId: 'u1',
			committeeId: 'c1'
		});
		seed(cache, {
			__typename: 'Conferenceuser',
			id: 'u1',
			presenceEvents: [ref('Presenceevent', 'e1'), ref('Presenceevent', 'e2')]
		});
		seed(cache, {
			__typename: 'Committee',
			id: 'c1',
			presenceEvents: [ref('Presenceevent', 'e1')]
		});
	}

	it('removes a deleted event from the lists the result names', () => {
		run((cache) => {
			seedEventLists(cache);
			updates.Mutation!.deletePresenceEvent!(
				{ deletePresenceEvent: { id: 'e1', conferenceUserId: 'u1', committeeId: 'c1' } },
				{},
				cache,
				info
			);
			expect(field(cache, 'Conferenceuser', 'u1', 'presenceEvents')).toEqual(['Presenceevent:e2']);
			expect(field(cache, 'Committee', 'c1', 'presenceEvents')).toEqual([]);
			expect(field(cache, 'Presenceevent', 'e1', 'committeeId')).toBeUndefined();
		});
	});

	it('falls back to the cached event for the lists to remove it from', () => {
		run((cache) => {
			seedEventLists(cache);
			updates.Mutation!.deletePresenceEvent!(
				{ deletePresenceEvent: { id: 'e1' } },
				{},
				cache,
				info
			);
			expect(field(cache, 'Conferenceuser', 'u1', 'presenceEvents')).toEqual(['Presenceevent:e2']);
			expect(field(cache, 'Committee', 'c1', 'presenceEvents')).toEqual([]);

			// Neither knows the lists: the event is only dropped
			updates.Mutation!.deletePresenceEvent!(
				{ deletePresenceEvent: { id: 'e2' } },
				{},
				cache,
				info
			);
			expect(field(cache, 'Conferenceuser', 'u1', 'presenceEvents')).toEqual(['Presenceevent:e2']);

			// No result, nothing to do
			updates.Mutation!.deletePresenceEvent!({ deletePresenceEvent: null }, {}, cache, info);
		});
	});

	it('links an inserted event into the user and committee lists', () => {
		run((cache) => {
			seedEventLists(cache);
			updates.Mutation!.insertPresenceEvent!(
				{ insertPresenceEvent: { id: 'e3' } },
				{ conferenceUserId: 'u1', committeeId: 'c1' },
				cache,
				info
			);
			updates.Mutation!.insertPresenceEvent!({ insertPresenceEvent: null }, {}, cache, info);
			expect(field(cache, 'Conferenceuser', 'u1', 'presenceEvents')).toEqual([
				'Presenceevent:e1',
				'Presenceevent:e2',
				'Presenceevent:e3'
			]);
			expect(field(cache, 'Committee', 'c1', 'presenceEvents')).toEqual([
				'Presenceevent:e1',
				'Presenceevent:e3'
			]);
		});
	});
});

describe('NSA scans', () => {
	function seedNsa(cache: Cache) {
		seed(cache, {
			__typename: 'Conferenceuser',
			id: 'nsa1',
			isCheckedIn: false,
			currentCommitteeId: null
		});
	}

	it('checks a cached NSA in', () => {
		run((cache) => {
			seedNsa(cache);
			const event = optimistic.recordNsaCheckIn!(
				{ id: 'e1', committeeId: 'c1', conferenceUserId: 'nsa1' },
				cache,
				info
			);
			expect(event).toMatchObject({
				conferenceUserId: 'nsa1',
				present: true,
				type: 'NSA_SCAN',
				timestamp: NOW
			});
			expect(field(cache, 'Conferenceuser', 'nsa1', 'isCheckedIn')).toBe(true);
			expect(field(cache, 'Conferenceuser', 'nsa1', 'currentCommitteeId')).toBe('c1');
			expect(field(cache, 'Conferenceuser', 'nsa1', 'currentCheckedInSince')).toEqual(NOW);
		});
	});

	it('checks a cached NSA out', () => {
		run((cache) => {
			seedNsa(cache);
			optimistic.recordNsaCheckIn!(
				{ id: 'e1', committeeId: 'c1', conferenceUserId: 'nsa1' },
				cache,
				info
			);
			const event = optimistic.recordNsaCheckOut!(
				{ id: 'e2', committeeId: 'c1', conferenceUserId: 'nsa1' },
				cache,
				info
			);
			expect(event).toMatchObject({ present: false, conferenceUserId: 'nsa1' });
			expect(field(cache, 'Conferenceuser', 'nsa1', 'isCheckedIn')).toBe(false);
			expect(field(cache, 'Conferenceuser', 'nsa1', 'currentCommitteeId')).toBeNull();
		});
	});

	it('records a pending event for an NSA the cache does not know', () => {
		run((cache) => {
			const unknown = optimistic.recordNsaCheckIn!(
				{ id: 'e1', committeeId: 'c1', conferenceUserId: 'nsa9' },
				cache,
				info
			);
			expect(unknown).toMatchObject({
				conferenceUserId: 'pending-e1',
				conferenceUser: ref('Conferenceuser', 'pending-e1')
			});
			const unnamed = optimistic.recordNsaCheckOut!({ id: 'e2', committeeId: 'c1' }, cache, info);
			expect(unnamed).toMatchObject({ conferenceUserId: 'pending-e2' });
			const blank = optimistic.recordNsaCheckOut!(
				{ id: 'e3', committeeId: 'c1', conferenceUserId: '' },
				cache,
				info
			);
			expect(blank).toMatchObject({ conferenceUserId: 'pending-e3' });
			updates.Mutation!.recordNsaCheckIn!({ recordNsaCheckIn: { id: 'e1' } }, {}, cache, info);
			updates.Mutation!.recordNsaCheckOut!({ recordNsaCheckOut: null }, {}, cache, info);
		});
	});
});

// ---------------------------------------------------------------------------
// Plain entity creations
// ---------------------------------------------------------------------------

describe('created entities', () => {
	it('fills a representation from its args', () => {
		const full = optimistic.createRepresentation!(
			{
				id: 'r1',
				conferenceId: 'conf1',
				type: 'DELEGATION',
				name: 'Germany',
				alpha2Code: 'de',
				alpha3Code: 'deu',
				icon: 'flag'
			},
			null as never,
			info
		);
		expect(full).toMatchObject({
			id: 'r1',
			conference: ref('Conference', 'conf1'),
			name: 'Germany',
			alpha2Code: 'de',
			alpha3Code: 'deu',
			icon: 'flag'
		});
		const bare = optimistic.createRepresentation!(
			{ id: 'r2', conferenceId: 'conf1', type: 'NSA' },
			null as never,
			info
		);
		expect(bare).toMatchObject({ name: null, alpha2Code: null, alpha3Code: null, icon: null });
	});

	it('fills a resolution paper from its args', () => {
		const full = optimistic.createResolutionPaper!(
			{
				id: 'p1',
				committeeId: 'c1',
				agendaItemId: 'a1',
				creatorCommitteeMemberId: 'm1',
				status: 'DRAFT',
				title: 'On peace'
			},
			null as never,
			info
		);
		expect(full).toMatchObject({
			creatorCommitteeMemberId: 'm1',
			creatorCommitteeMember: ref('Committeemember', 'm1'),
			status: 'DRAFT',
			title: 'On peace'
		});
		const bare = optimistic.createResolutionPaper!(
			{ id: 'p2', committeeId: 'c1', agendaItemId: 'a1' },
			null as never,
			info
		);
		expect(bare).toMatchObject({
			creatorCommitteeMemberId: null,
			creatorCommitteeMember: null,
			status: 'WORKING_PAPER',
			title: null
		});
	});

	it('fills a resolution comment from its args', () => {
		const reply = optimistic.createResolutionComment!(
			{
				id: 'rc2',
				paperId: 'p1',
				clauseId: 'cl1',
				content: 'Agreed',
				visibility: 'CHAIRS',
				parentCommentId: 'rc1'
			},
			null as never,
			info
		);
		expect(reply).toMatchObject({
			clauseId: 'cl1',
			visibility: 'CHAIRS',
			parentCommentId: 'rc1',
			parent: ref('Resolutioncomment', 'rc1')
		});
		const root = optimistic.createResolutionComment!(
			{ id: 'rc1', paperId: 'p1', content: 'Hm' },
			null as never,
			info
		);
		expect(root).toMatchObject({
			clauseId: null,
			visibility: 'PUBLIC',
			parentCommentId: null,
			parent: null
		});
	});
});

// ---------------------------------------------------------------------------
// Speakers lists
// ---------------------------------------------------------------------------

describe('optimistic.addSpeakerOnList', () => {
	const add = (cache: Cache, args: Variables) =>
		optimistic.addSpeakerOnList!(args, cache, info) as Data;

	it('needs exactly one of the member ids', () => {
		run((cache) => {
			expect(add(cache, { speakersListId: 'sl1' })).toBeNull();
			expect(
				add(cache, { speakersListId: 'sl1', committeeMemberId: 'm1', conferenceMemberId: 'cm1' })
			).toBeNull();
		});
	});

	it('appends to a cached list, linking the member with its representation', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0 }] });
			seed(cache, {
				__typename: 'Committeemember',
				id: 'm1',
				representation: representation('r1')
			});
			const result = add(cache, { id: 's1', speakersListId: 'sl1', committeeMemberId: 'm1' });
			expect(result).toMatchObject({
				id: 's1',
				position: 1,
				committeeMemberId: 'm1',
				conferenceMemberId: null,
				committeeMember: { id: 'm1', representation: { id: 'r1', name: 'Rep r1' } },
				conferenceMember: null
			});
			expect(speakersOf(cache)).toEqual(['s0@0', 's1@1']);
		});
	});

	it('inserts at an explicit position, shifting the entries from there', () => {
		run((cache) => {
			seedSpeakersList(cache, {
				speakers: [
					{ id: 's0', position: 0 },
					{ id: 's1', position: 1 }
				]
			});
			const result = add(cache, {
				id: 'new',
				speakersListId: 'sl1',
				conferenceMemberId: 'cm1',
				position: 0
			});
			expect(result).toMatchObject({ position: 0, conferenceMemberId: 'cm1' });
			expect(speakersOf(cache)).toEqual(['new@0', 's0@1', 's1@2']);

			// A repeat run for the same call keeps the entry where it is
			const again = add(cache, {
				id: 'new',
				speakersListId: 'sl1',
				conferenceMemberId: 'cm1',
				position: 0
			});
			expect(again.position).toBe(0);
			expect(speakersOf(cache)).toEqual(['new@0', 's0@1', 's1@2']);
		});
	});

	it('answers the end of an uncached list without writing it', () => {
		run((cache) => {
			const result = add(cache, { id: 's1', speakersListId: 'sl9', committeeMemberId: 'm1' });
			expect(result).toMatchObject({ position: 0, committeeMember: null });
			expect(field(cache, 'Speakerslist', 'sl9', 'speakers')).toBeUndefined();
		});
	});
});

describe('self speaker entries', () => {
	const selfAdd = (cache: Cache, speakersListId = 'sl1') =>
		optimistic.selfAddToSpeakersList!({ id: 'mine', speakersListId }, cache, info) as Data | null;

	it('adds a delegate by their committee member', () => {
		run((cache) => {
			seedUnrelatedRootFields(cache);
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0, committeeMemberId: 'm0' }] });
			seedConferenceUser(cache, { id: 'other', conferenceId: 'conf2' });
			seedConferenceUser(cache, { id: 'chair', conferenceUserType: 'CHAIR' });
			seedConferenceUser(cache, { id: 'hidden', committeeMemberId: 'm9', userEmail: null });
			seedConferenceUser(cache);
			expect(selfAdd(cache)).toMatchObject({
				id: 'mine',
				position: 1,
				committeeMemberId: 'm1',
				conferenceMemberId: null
			});
		});
	});

	it('adds a non-state actor by their conference member, in any conference', () => {
		run((cache) => {
			seedSpeakersList(cache, { conferenceId: null });
			seedConferenceUser(cache, {
				conferenceUserType: 'NON_STATE_ACTOR',
				committeeMemberId: null,
				conferenceMemberId: 'cm1',
				conferenceId: 'conf7'
			});
			expect(selfAdd(cache)).toMatchObject({
				position: 0,
				committeeMemberId: null,
				conferenceMemberId: 'cm1'
			});
		});
	});

	it('adds no one where self-adding is off, closed, unknown, or done already', () => {
		run((cache) => {
			expect(selfAdd(cache, 'sl9')).toBeNull();
			seedSpeakersList(cache, { id: 'off', allow: false });
			seedSpeakersList(cache, { id: 'closed', isClosed: true });
			seedConferenceUser(cache);
			expect(selfAdd(cache, 'off')).toBeNull();
			expect(selfAdd(cache, 'closed')).toBeNull();
			seedSpeakersList(cache, {
				id: 'on',
				speakers: [{ id: 's0', position: 0, committeeMemberId: 'm1' }]
			});
			expect(selfAdd(cache, 'on')).toBeNull();
		});
	});

	it('adds no delegate without a seat and no non-state actor without a member', () => {
		run((cache) => {
			seedSpeakersList(cache);
			seedConferenceUser(cache, { committeeMemberId: null });
			expect(selfAdd(cache)).toBeNull();
		});
		run((cache) => {
			seedSpeakersList(cache, { id: 'sl2' });
			seedConferenceUser(cache, {
				id: 'nsa',
				conferenceUserType: 'NON_STATE_ACTOR',
				committeeMemberId: null,
				conferenceMemberId: null
			});
			expect(selfAdd(cache, 'sl2')).toBeNull();
		});
	});

	it('removes the caller’s own entry, optimistically and on the result', () => {
		run((cache) => {
			seedSpeakersList(cache, {
				speakers: [
					{ id: 's0', position: 0, committeeMemberId: 'm0' },
					{ id: 's1', position: 1, committeeMemberId: 'm1' },
					{ id: 's2', position: 2, committeeMemberId: 'm2' }
				]
			});
			seedConferenceUser(cache);
			expect(
				optimistic.selfRemoveFromSpeakersList!({ speakersListId: 'sl1' }, cache, info)
			).toEqual({
				__typename: 'Speakerslist',
				id: 'sl1',
				speakers: [
					{ __typename: 'Speakeronlist', id: 's0', position: 0 },
					{ __typename: 'Speakeronlist', id: 's2', position: 1 }
				]
			});
			updates.Mutation!.selfRemoveFromSpeakersList!({}, { speakersListId: 'sl1' }, cache, info);
			expect(speakersOf(cache)).toEqual(['s0@0', 's2@1']);
		});
	});

	it('removes nothing without a list, a self or an own entry', () => {
		run((cache) => {
			const remove = (speakersListId: string) =>
				optimistic.selfRemoveFromSpeakersList!({ speakersListId }, cache, info);
			expect(remove('sl9')).toBeNull();
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0, committeeMemberId: 'm0' }] });
			expect(remove('sl1')).toBeNull();
			seedConferenceUser(cache);
			expect(remove('sl1')).toBeNull();
			updates.Mutation!.selfRemoveFromSpeakersList!({}, { speakersListId: 'sl1' }, cache, info);
			expect(speakersOf(cache)).toEqual(['s0@0']);
		});
	});

	it('links a confirmed self-add at the end of the list', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0 }] });
			updates.Mutation!.selfAddToSpeakersList!(
				{ selfAddToSpeakersList: { id: 'mine' } },
				{ speakersListId: 'sl1' },
				cache,
				info
			);
			expect(speakersOf(cache)).toEqual(['s0@0', 'mine@1']);
		});
	});
});

describe('speaker removal and moves', () => {
	const threeSpeakers = [
		{ id: 's0', position: 0 },
		{ id: 's1', position: 1 },
		{ id: 's2', position: 2 }
	];
	const move = (cache: Cache, id: string, position: number) =>
		optimistic.moveSpeakerToPosition!({ id, position }, cache, info) as Data | null;

	it('moves an entry down, shifting the ones it passes up', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: threeSpeakers });
			expect(move(cache, 's0', 2)).toEqual({
				__typename: 'Speakeronlist',
				id: 's0',
				position: 2,
				speakersListId: 'sl1'
			});
			expect(speakersOf(cache)).toEqual(['s1@0', 's2@1', 's0@2']);
		});
	});

	it('moves an entry up, clamped to the list', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: threeSpeakers });
			expect(move(cache, 's2', -3)?.position).toBe(0);
			expect(speakersOf(cache)).toEqual(['s2@0', 's0@1', 's1@2']);
			expect(move(cache, 's2', 10)?.position).toBe(2);
			expect(speakersOf(cache)).toEqual(['s0@0', 's1@1', 's2@2']);
		});
	});

	it('moves nothing in place or without the entry and its list', () => {
		run((cache) => {
			expect(move(cache, 's0', 1)).toBeNull();
			seed(cache, { __typename: 'Speakeronlist', id: 'lost', speakersListId: 'sl9', position: 0 });
			expect(move(cache, 'lost', 1)).toBeNull();
			seedSpeakersList(cache, { speakers: threeSpeakers });
			expect(move(cache, 's1', 1)).toBeNull();
		});
	});

	it('removes an entry, closing the gap', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: threeSpeakers });
			expect(optimistic.removeSpeakerOnList!({ speakerOnListId: 's0' }, cache, info)).toEqual({
				__typename: 'Speakerslist',
				id: 'sl1',
				speakers: [
					{ __typename: 'Speakeronlist', id: 's1', position: 0 },
					{ __typename: 'Speakeronlist', id: 's2', position: 1 }
				]
			});
			updates.Mutation!.removeSpeakerOnList!({}, { speakerOnListId: 's0' }, cache, info);
			expect(speakersOf(cache)).toEqual(['s1@0', 's2@1']);
			updates.Mutation!.removeSpeakerOnList!({}, { speakerOnListId: 'gone' }, cache, info);
			expect(optimistic.removeSpeakerOnList!({ speakerOnListId: 'gone' }, cache, info)).toBeNull();
		});
	});
});

describe('updates.addSpeakerOnList', () => {
	const confirm = (cache: Cache, speaker: Data | null, args: Data = {}) =>
		updates.Mutation!.addSpeakerOnList!(
			{ addSpeakerOnList: speaker },
			{ speakersListId: 'sl1', ...args },
			cache,
			info
		);

	it('links the confirmed entry at its own position', () => {
		run((cache) => {
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0 }] });
			confirm(cache, { id: 'new', position: 0 });
			// Ties go by id
			expect(speakersOf(cache)).toEqual(['new@0', 's0@1']);
		});
	});

	it('links it at an explicit position, else at the end', () => {
		run((cache) => {
			seedSpeakersList(cache, {
				speakers: [
					{ id: 's0', position: 0 },
					{ id: 's1', position: 1 }
				]
			});
			confirm(cache, { id: 'mid' }, { position: 1 });
			expect(speakersOf(cache)).toEqual(['s0@0', 'mid@1', 's1@2']);
			confirm(cache, { id: 'last' });
			expect(speakersOf(cache)).toEqual(['s0@0', 'mid@1', 's1@2', 'last@3']);
		});
	});

	it('leaves the list alone without a result, a cached list, or for a linked entry', () => {
		run((cache) => {
			confirm(cache, null);
			confirm(cache, { id: 'x' }, { speakersListId: 'sl9' });
			seedSpeakersList(cache, { speakers: [{ id: 's0', position: 0 }] });
			confirm(cache, { id: 's0', position: 3 });
			expect(speakersOf(cache)).toEqual(['s0@0']);
		});
	});
});

describe('optimistic.updateSpeakersList', () => {
	const seedTimer = (cache: Cache, timer: Data) =>
		seed(cache, { __typename: 'Speakerslist', id: 'sl1', ...timer });
	const update = (cache: Cache, args: Data) =>
		optimistic.updateSpeakersList!({ id: 'sl1', ...args }, cache, info) as Data;
	const running = {
		phase: 'SPEECH',
		timeLeft: 60,
		startTimestamp: new Date(NOW.getTime() - 10_000).toISOString()
	};

	it('starts the timer from the given anchor, resuming a finished phase', () => {
		run((cache) => {
			seedTimer(cache, { phase: 'SPEECH_DONE', timeLeft: 30, startTimestamp: null });
			expect(
				update(cache, { timeLeft: 30, startTimestamp: '2026-01-01T11:59:00.000Z', isClosed: true })
			).toEqual({
				__typename: 'Speakerslist',
				id: 'sl1',
				isClosed: true,
				timeLeft: 30,
				startTimestamp: new Date('2026-01-01T11:59:00.000Z'),
				phase: 'SPEECH'
			});
		});
	});

	it('writes no timer fields or phase when none are given', () => {
		run((cache) => {
			seedTimer(cache, running);
			expect(update(cache, { speakingTime: 90 })).toEqual({
				__typename: 'Speakerslist',
				id: 'sl1',
				speakingTime: 90
			});
		});
	});

	it('stops the timer with the remaining time on the server clock', () => {
		run((cache) => {
			seedTimer(cache, running);
			expect(update(cache, { stopTimer: true })).toMatchObject({
				startTimestamp: null,
				timeLeft: 50,
				phase: 'SPEECH_DONE'
			});
		});
	});

	it('stops with a given time, back to a speech', () => {
		run((cache) => {
			seedTimer(cache, { ...running, phase: 'ANSWER' });
			expect(update(cache, { stopTimer: true, timeLeft: 120 })).toMatchObject({
				startTimestamp: null,
				timeLeft: 120,
				phase: 'SPEECH'
			});
		});
	});

	it('stops a timer the cache does not know as running', () => {
		run((cache) => {
			seedTimer(cache, { phase: 'SPEECH', timeLeft: null, startTimestamp: null });
			const stopped = update(cache, { stopTimer: true });
			expect(stopped).toMatchObject({ startTimestamp: null, phase: 'SPEECH_DONE' });
			expect(stopped).not.toHaveProperty('timeLeft');
		});
		run = makeCacheRunner();
		run((cache) => {
			const stopped = update(cache, { stopTimer: true });
			expect(stopped).toEqual({ __typename: 'Speakerslist', id: 'sl1', startTimestamp: null });
		});
	});

	it('takes an explicit phase over the derived one', () => {
		run((cache) => {
			seedTimer(cache, running);
			expect(update(cache, { stopTimer: true, phase: 'ANSWER' }).phase).toBe('ANSWER');
		});
	});
});

// ---------------------------------------------------------------------------
// Voting
// ---------------------------------------------------------------------------

describe('voting sessions', () => {
	const start = (args: Data) =>
		optimistic.startVotingSession!(
			{ id: 'v1', committeeId: 'c1', majority: 'SIMPLE', withAbstentions: true, ...args },
			null as never,
			info
		) as Data;

	it('starts a show of hands at the pro stage', () => {
		expect(start({ mode: 'SHOW_OF_HANDS' })).toMatchObject({
			mode: 'SHOW_OF_HANDS',
			currentStage: 'PRO',
			voteName: null,
			deviceVotingWindowSeconds: null,
			deviceVotingStartedAt: null
		});
		expect(start({ mode: 'SHOW_OF_HANDS', currentStage: 'CON', voteName: 'Res 1' })).toMatchObject({
			currentStage: 'CON',
			voteName: 'Res 1'
		});
	});

	it('opens the device voting window now', () => {
		expect(start({ mode: 'DEVICE_BASED' })).toMatchObject({
			currentStage: null,
			deviceVotingWindowSeconds: 20,
			deviceVotingStartedAt: NOW
		});
		expect(start({ mode: 'DEVICE_BASED', deviceVotingWindowSeconds: 45 })).toMatchObject({
			deviceVotingWindowSeconds: 45
		});
	});

	it('marks the confirmed session active and backfills its details', () => {
		run((cache) => {
			updates.Mutation!.startVotingSession!({ startVotingSession: null }, {}, cache, info);
			updates.Mutation!.startVotingSession!(
				{ startVotingSession: { id: 'v1' } },
				{ committeeId: 'c1', mode: 'ROLL_CALL', majority: 'SIMPLE', withAbstentions: false },
				cache,
				info
			);
			expect(field(cache, 'Committee', 'c1', 'activeVotingSessionId')).toBe('v1');
			expect(field(cache, 'Committee', 'c1', 'activeVotingSession')).toBe('Votingsession:v1');
			expect(field(cache, 'Votingsession', 'v1', 'voteName')).toBeNull();
			expect(field(cache, 'Votingsession', 'v1', 'deviceVotingStartedAt')).toBeNull();

			updates.Mutation!.startVotingSession!(
				{
					startVotingSession: {
						id: 'v2',
						deviceVotingStartedAt: '2026-01-01T11:00:00.000Z',
						deviceVotingWindowSeconds: 30
					}
				},
				{
					committeeId: 'c1',
					mode: 'DEVICE_BASED',
					majority: 'SIMPLE',
					withAbstentions: true,
					voteName: 'Res 2'
				},
				cache,
				info
			);
			expect(field(cache, 'Votingsession', 'v2', 'voteName')).toBe('Res 2');
			expect(field(cache, 'Votingsession', 'v2', 'deviceVotingStartedAt')).toBe(
				'2026-01-01T11:00:00.000Z'
			);
			expect(field(cache, 'Votingsession', 'v2', 'deviceVotingWindowSeconds')).toBe(30);
		});
	});

	function seedVotes(cache: Cache) {
		seed(cache, {
			__typename: 'Votingsession',
			id: 'vs1',
			votes: [{ __typename: 'Votingvote', id: 'old', committeeMemberId: 'm1' }]
		});
		seed(cache, {
			__typename: 'Committeemember',
			id: 'm1',
			votingVotes: [ref('Votingvote', 'old')]
		});
	}
	const voteArgs = { sessionId: 'vs1', committeeMemberId: 'm1', vote: 'PRO' };

	it('keeps a member’s vote id when they vote again', () => {
		run((cache) => {
			seedVotes(cache);
			expect(optimistic.setVoteForMember!({ ...voteArgs, id: 'fresh' }, cache, info)).toMatchObject(
				{ id: 'old', vote: 'PRO' }
			);
		});
	});

	it('replaces a member’s earlier vote with the confirmed one', () => {
		run((cache) => {
			seedVotes(cache);
			updates.Mutation!.setVoteForMember!({ setVoteForMember: null }, voteArgs, cache, info);
			updates.Mutation!.setVoteForMember!(
				{ setVoteForMember: { id: 'old' } },
				voteArgs,
				cache,
				info
			);
			expect(field(cache, 'Votingsession', 'vs1', 'votes')).toEqual(['Votingvote:old']);

			seed(cache, { __typename: 'Votingvote', id: 'new', committeeMemberId: 'm1' });
			updates.Mutation!.setVoteForMember!(
				{ setVoteForMember: { id: 'new' } },
				voteArgs,
				cache,
				info
			);
			expect(field(cache, 'Votingsession', 'vs1', 'votes')).toEqual(['Votingvote:new']);
			expect(field(cache, 'Committeemember', 'm1', 'votingVotes')).toEqual(['Votingvote:new']);
		});
	});

	it('adds a first vote', () => {
		run((cache) => {
			updates.Mutation!.setVoteForMember!(
				{ setVoteForMember: { id: 'first' } },
				voteArgs,
				cache,
				info
			);
			expect(field(cache, 'Votingsession', 'vs1', 'votes')).toEqual(['Votingvote:first']);
			expect(field(cache, 'Committeemember', 'm1', 'votingVotes')).toEqual(['Votingvote:first']);
		});
	});
});

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------

describe('list maintenance', () => {
	it('adds a created entity to every cached variant of its parent list', () => {
		run((cache) => {
			const committee = ref('Committee', 'c1');
			cache.link(committee, 'agendaItems', { where: 'a' }, ['Agendaitem:a0']);
			cache.link(committee, 'agendaItems', { where: 'b' }, ['Agendaitem:a0', 'Agendaitem:a1']);
			cache.link(committee, 'agendaItems', { where: 'c' }, null);
			updates.Mutation!.createAgendaItem!(
				{ createAgendaItem: { id: 'a1' } },
				{ committeeId: 'c1' },
				cache,
				info
			);
			updates.Mutation!.createAgendaItem!({ createAgendaItem: null }, {}, cache, info);
			expect(cache.resolve(committee, 'agendaItems', { where: 'a' })).toEqual([
				'Agendaitem:a0',
				'Agendaitem:a1'
			]);
			expect(cache.resolve(committee, 'agendaItems', { where: 'b' })).toEqual([
				'Agendaitem:a0',
				'Agendaitem:a1'
			]);
			expect(cache.resolve(committee, 'agendaItems', { where: 'c' })).toBeNull();
		});
	});

	it('starts the list of a parent that has none', () => {
		run((cache) => {
			updates.Mutation!.createRepresentation!(
				{ createRepresentation: { id: 'r1' } },
				{ conferenceId: 'conf1' },
				cache,
				info
			);
			updates.Mutation!.createRepresentation!({ createRepresentation: null }, {}, cache, info);
			expect(field(cache, 'Conference', 'conf1', 'representations')).toEqual(['Representation:r1']);
		});
	});

	it('links papers and comments into their parents', () => {
		run((cache) => {
			updates.Mutation!.createResolutionPaper!(
				{ createResolutionPaper: { id: 'p1' } },
				{ committeeId: 'c1' },
				cache,
				info
			);
			updates.Mutation!.createResolutionPaper!({ createResolutionPaper: null }, {}, cache, info);
			expect(field(cache, 'Committee', 'c1', 'resolutionPapers')).toEqual(['Resolutionpaper:p1']);

			const comment = (id: string, parentCommentId: string | null = null) =>
				updates.Mutation!.createResolutionComment!(
					{ createResolutionComment: { id } },
					{ paperId: 'p1', parentCommentId },
					cache,
					info
				);
			comment('rc1');
			comment('rc2', 'rc1');
			updates.Mutation!.createResolutionComment!(
				{ createResolutionComment: null },
				{},
				cache,
				info
			);
			expect(field(cache, 'Resolutionpaper', 'p1', 'comments')).toEqual([
				'Resolutioncomment:rc1',
				'Resolutioncomment:rc2'
			]);
			expect(field(cache, 'Resolutioncomment', 'rc1', 'replies')).toEqual([
				'Resolutioncomment:rc2'
			]);
		});
	});

	it('keeps one operative clause vote per clause', () => {
		run((cache) => {
			seed(cache, {
				__typename: 'Resolutionpaper',
				id: 'p1',
				operativeClauseVotes: [
					{ __typename: 'Operativeclausevote', id: 'ocv1', clauseId: 'cl1' },
					{ __typename: 'Operativeclausevote', id: 'ocv2', clauseId: 'cl2' }
				]
			});
			const link = (id: string, clauseId: string) =>
				updates.Mutation!.linkOperativeClauseVote!(
					{ linkOperativeClauseVote: { id } },
					{ paperId: 'p1', clauseId },
					cache,
					info
				);
			link('ocv1', 'cl1');
			expect(field(cache, 'Resolutionpaper', 'p1', 'operativeClauseVotes')).toEqual([
				'Operativeclausevote:ocv1',
				'Operativeclausevote:ocv2'
			]);
			link('ocv3', 'cl1');
			updates.Mutation!.linkOperativeClauseVote!(
				{ linkOperativeClauseVote: null },
				{},
				cache,
				info
			);
			expect(field(cache, 'Resolutionpaper', 'p1', 'operativeClauseVotes')).toEqual([
				'Operativeclausevote:ocv2',
				'Operativeclausevote:ocv3'
			]);
			expect(field(cache, 'Operativeclausevote', 'ocv1', 'clauseId')).toBeUndefined();

			updates.Mutation!.unlinkOperativeClauseVote!(
				{},
				{ paperId: 'p1', clauseId: 'cl2' },
				cache,
				info
			);
			expect(field(cache, 'Resolutionpaper', 'p1', 'operativeClauseVotes')).toEqual([
				'Operativeclausevote:ocv3'
			]);
		});
	});

	it('refetches the conference indexes after an import', () => {
		run((cache) => {
			cache.link('Query', 'findManyConferences', ['Conference:conf1']);
			cache.link('Query', 'findManyCommittees', ['Committee:c1']);
			updates.Mutation!.importDelegatorConference!(
				{ importDelegatorConference: null },
				{},
				cache,
				info
			);
			expect(cache.resolve('Query', 'findManyConferences')).toEqual(['Conference:conf1']);
			updates.Mutation!.importDelegatorConference!(
				{ importDelegatorConference: { id: 'conf2' } },
				{},
				cache,
				info
			);
			expect(cache.resolve('Query', 'findManyConferences')).toBeUndefined();
			expect(cache.resolve('Query', 'findManyCommittees')).toEqual(['Committee:c1']);
		});
	});
});

// ---------------------------------------------------------------------------
// Amendments
// ---------------------------------------------------------------------------

describe('amendments', () => {
	const forPaper = (id: string) => ({ where: { paper: { id } } });
	const forAmendment = (id: string) => ({ where: { amendment: { id } } });

	function seedAmendmentLists(cache: Cache) {
		cache.link('Query', 'amendments', forPaper('p1'), []);
		cache.link('Query', 'amendments', forPaper('p2'), []);
		cache.link('Query', 'amendments', forPaper('p1x'), ['Amendment:am1']);
		cache.link('Subscription', 'amendments', forPaper('p1'), []);
		cache.link('Query', 'amendmentSponsors', forAmendment('am1'), []);
		cache.link('Query', 'amendmentSponsors', forAmendment('am2'), []);
	}

	it('creates an amendment sponsored by the chair-given proposer', () => {
		run((cache) => {
			seedAmendmentLists(cache);
			seed(cache, {
				__typename: 'Committeemember',
				id: 'm1',
				representation: representation('r1')
			});
			const created = optimistic.createAmendment!(
				{
					id: 'am1',
					paperId: 'p1',
					proposerCommitteeMemberId: 'm1',
					type: 'ADD',
					status: 'SUBMITTED',
					targetClauseId: 'cl1',
					targetOperativeIndex: 2,
					newContent: '<p>x</p>',
					targetPosition: 3
				},
				cache,
				info
			) as Data;
			expect(created).toMatchObject({
				proposerCommitteeMemberId: 'm1',
				proposer: ref('Committeemember', 'm1'),
				type: 'ADD',
				status: 'SUBMITTED',
				targetClauseId: 'cl1',
				targetOperativeIndex: 2,
				newContent: '<p>x</p>',
				targetPosition: 3
			});
			expect(created.sponsors).toHaveLength(1);
			expect(cache.resolve('Query', 'amendments', forPaper('p1'))).toEqual(['Amendment:am1']);
			expect(cache.resolve('Subscription', 'amendments', forPaper('p1'))).toEqual([
				'Amendment:am1'
			]);
			expect(cache.resolve('Query', 'amendments', forPaper('p2'))).toEqual([]);
			expect(cache.resolve('Query', 'amendmentSponsors', forAmendment('am1'))).toHaveLength(1);
			expect(cache.resolve('Query', 'amendmentSponsors', forAmendment('am2'))).toEqual([]);
		});
	});

	it('takes a delegate’s own seat as the proposer', () => {
		run((cache) => {
			seed(cache, { __typename: 'Resolutionpaper', id: 'p1', committeeId: 'c1' });
			seed(cache, { __typename: 'Committee', id: 'c1', conferenceId: 'conf1' });
			seedConferenceUser(cache);
			const created = optimistic.createAmendment!(
				{ id: 'am1', paperId: 'p1', type: 'DELETE' },
				cache,
				info
			) as Data;
			expect(created).toMatchObject({
				proposerCommitteeMemberId: 'm1',
				status: 'PENDING',
				targetClauseId: null,
				targetOperativeIndex: null,
				newContent: null,
				targetPosition: null
			});
		});
	});

	it('creates an amendment without a proposer where none is known', () => {
		run((cache) => {
			const unknownPaper = optimistic.createAmendment!(
				{ id: 'am1', paperId: 'p9', type: 'ADD' },
				cache,
				info
			) as Data;
			expect(unknownPaper).toMatchObject({
				proposerCommitteeMemberId: null,
				proposer: null,
				sponsors: []
			});

			seed(cache, { __typename: 'Resolutionpaper', id: 'p1', committeeId: 'c1' });
			const noSelf = optimistic.createAmendment!(
				{ id: 'am2', paperId: 'p1', type: 'ADD' },
				cache,
				info
			) as Data;
			expect(noSelf.proposerCommitteeMemberId).toBeNull();
		});
	});

	it('writes the confirmed amendment and links it into its lists', () => {
		run((cache) => {
			seedAmendmentLists(cache);
			updates.Mutation!.createAmendment!({ createAmendment: null }, {}, cache, info);
			updates.Mutation!.createAmendment!(
				{ createAmendment: { id: 'am1' } },
				{ paperId: 'p1', type: 'ADD', newContent: 'x' },
				cache,
				info
			);
			expect(field(cache, 'Amendment', 'am1', 'status')).toBe('PENDING');
			expect(field(cache, 'Amendment', 'am1', 'newContent')).toBe('x');
			expect(field(cache, 'Resolutionpaper', 'p1', 'amendments')).toEqual(['Amendment:am1']);
			expect(cache.resolve('Query', 'amendments', forPaper('p1'))).toEqual(['Amendment:am1']);
		});
	});

	it('removes a sponsor from its amendment and the matching sponsor lists', () => {
		run((cache) => {
			seed(cache, {
				__typename: 'Amendment',
				id: 'am1',
				sponsors: [
					{ __typename: 'Amendmentsponsor', id: 'sp1', amendmentId: 'am1' },
					{ __typename: 'Amendmentsponsor', id: 'sp2', amendmentId: 'am1' }
				]
			});
			cache.link('Query', 'amendmentSponsors', forAmendment('am1'), [
				'Amendmentsponsor:sp1',
				'Amendmentsponsor:sp2'
			]);
			cache.link('Query', 'amendmentSponsors', forAmendment('am2'), ['Amendmentsponsor:sp3']);
			updates.Mutation!.removeAmendmentSponsor!({}, { id: 'sp1' }, cache, info);
			updates.Mutation!.removeAmendmentSponsor!({}, { id: 'unknown' }, cache, info);
			expect(field(cache, 'Amendment', 'am1', 'sponsors')).toEqual(['Amendmentsponsor:sp2']);
			expect(cache.resolve('Query', 'amendmentSponsors', forAmendment('am1'))).toEqual([
				'Amendmentsponsor:sp2'
			]);
			expect(cache.resolve('Query', 'amendmentSponsors', forAmendment('am2'))).toEqual([
				'Amendmentsponsor:sp3'
			]);
			expect(field(cache, 'Amendmentsponsor', 'sp1', 'amendmentId')).toBeUndefined();
		});
	});
});
