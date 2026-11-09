import { db, schema } from '#api/db/db';
import { and, eq, sql } from 'drizzle-orm';
import { createDelegatorClient, type DelegatorClient } from './delegatorRemote';
import { instanceLinkPubsub } from './linkPubsub';
import { openLinkToken } from './linkTokens';
import { mirrorConference } from './mirror';
import { reconcileConference, releaseConference } from './reconcile';
import { syncWorkingPapers } from './workingPaperSync';
import { readAll } from './readAll';

/**
 * The link worker (`docs/plans/delegator-link.md`): mirrors every DELEGATOR conference that has not
 * ended. It runs in one app process at a time (a Postgres advisory lock), subscribes to DELEGATOR's
 * live queries, and on any change reads the conference afresh and reconciles it. The stream's
 * (re)connect reconciles everything, since events may have been missed while it was down. There is
 * no timer: a dead stream is noticed by the transport, and the reconnect catches up.
 */

/** pg advisory lock key for the worker, any constant no other lock uses. */
const LEADER_LOCK_KEY = 4_812_771;
/** A change usually touches several tables at once; one read after it is enough. */
const DEBOUNCE_MS = 400;

let running: { stop: () => void } | undefined;

export function startLinkWorker() {
	running ??= runWorker();
}

export function stopLinkWorker() {
	running?.stop();
	running = undefined;
}

/** On server start: picks the link up again when this instance is linked. */
export async function resumeLinkWorker() {
	const link = await db.query.instanceLink.findFirst({
		where: { status: 'ACTIVE' },
		columns: { id: true }
	});
	if (link) startLinkWorker();
}

function runWorker() {
	let stopped = false;
	const cleanups: (() => void)[] = [];
	const stop = () => {
		stopped = true;
		for (const cleanup of cleanups.splice(0).reverse()) cleanup();
	};

	(async () => {
		// a string under `drizzle.mock()`, which only `vite build` uses
		if (typeof db.$client === 'string') return;
		const leadership = await db.$client.connect();
		cleanups.push(() => {
			leadership
				.query('select pg_advisory_unlock($1)', [LEADER_LOCK_KEY])
				.finally(() => leadership.release());
		});
		// waits for the instance holding the worker to stop or die
		await leadership.query('select pg_advisory_lock($1)', [LEADER_LOCK_KEY]);
		if (stopped) return;

		const link = await db.query.instanceLink.findFirst({ where: { status: 'ACTIVE' } });
		if (!link) return stop();

		const watchers = new Map<string, () => void>();
		const timers = new Map<string, ReturnType<typeof setTimeout>>();
		cleanups.push(() => {
			for (const timer of timers.values()) clearTimeout(timer);
			for (const unwatch of watchers.values()) unwatch();
		});

		let reconnected = () => {};
		const remote: DelegatorClient = createDelegatorClient({
			url: link.remoteUrl,
			token: openLinkToken(link.outboundToken),
			onConnected: () => {
				void storeIdentityKey({ remote, linkId: link.id });
				reconnected();
				for (const conferenceId of watchers.keys()) schedule(conferenceId);
			}
		});
		cleanups.push(() => remote.dispose());

		// One sync per conference at a time: a big conference takes a while to read, and two at once
		// would both create what is new. A change meanwhile asks for one more pass afterwards.
		const syncing = new Set<string>();
		const again = new Set<string>();
		const sync = (conferenceId: string) => {
			if (syncing.has(conferenceId)) {
				again.add(conferenceId);
				return;
			}
			syncing.add(conferenceId);
			void syncConference({ remote, linkId: link.id, conferenceId }).finally(() => {
				syncing.delete(conferenceId);
				if (again.delete(conferenceId) && !stopped) sync(conferenceId);
			});
		};

		const schedule = (conferenceId: string) => {
			clearTimeout(timers.get(conferenceId));
			timers.set(
				conferenceId,
				setTimeout(() => {
					timers.delete(conferenceId);
					if (!stopped) sync(conferenceId);
				}, DEBOUNCE_MS)
			);
		};

		// DELEGATOR shows the link the conferences it mirrors; a public one that has ended may
		// still be readable, so the state decides
		// A live query's first answer may fail (DELEGATOR unreachable, a rule refusing): that is noted
		// on the link and retried on the next (re)connect, never left to crash the app.
		const failed = (error: unknown) => void recordError({ linkId: link.id, error });
		// Set up again on every (re)connect: a first answer that failed (the other side was away)
		// leaves no watch behind otherwise, and a broken stream ends the subscriptions it carried.
		let unwatchConferences: (() => void) | undefined;
		const watchConferences = () => {
			unwatchConferences?.();
			const conferences = handled(remote.liveQuery.conferences({ id: true, state: true }), failed);
			unwatchConferences = listen(conferences, (list) => {
				if (!list || stopped) return;
				const current = new Set(list.filter((c) => c.state !== 'POST').map((c) => c.id));
				for (const [conferenceId, unwatch] of watchers) {
					if (current.has(conferenceId)) continue;
					unwatch();
					watchers.delete(conferenceId);
					void releaseConference(conferenceId).catch((error) =>
						recordError({ linkId: link.id, error })
					);
				}
				for (const conferenceId of current) {
					if (!watchers.has(conferenceId)) {
						watchers.set(
							conferenceId,
							watchConference({ remote, conferenceId, onChange: schedule, onError: failed })
						);
					}
					schedule(conferenceId);
				}
			});
		};
		// A stream that broke takes the subscriptions on it along, so every watch starts afresh
		reconnected = () => {
			for (const [conferenceId, unwatch] of watchers) {
				unwatch();
				watchers.set(
					conferenceId,
					watchConference({ remote, conferenceId, onChange: schedule, onError: failed })
				);
			}
			watchConferences();
		};
		watchConferences();
		cleanups.push(() => unwatchConferences?.());
	})().catch((error) => {
		console.error('[link] the link worker stopped', error);
		stop();
		running = undefined;
	});

	return { stop };
}

/**
 * Subscribes to a live query and answers how to stop. rumble types `subscribe` as answering an
 * unsubscribe function, but its observable answers `{ unsubscribe }`: calling that threw and
 * stopped the worker hearing of changes. Both shapes are handled.
 */
function listen<T>(
	result: { subscribe: (next: (value: T) => void) => unknown },
	next: (value: T) => void
) {
	const subscription: unknown = result.subscribe(next);
	return () => {
		if (typeof subscription === 'function') subscription();
		else if (
			typeof subscription === 'object' &&
			subscription !== null &&
			'unsubscribe' in subscription &&
			typeof subscription.unsubscribe === 'function'
		)
			subscription.unsubscribe();
	};
}

/** Lets a live query's first answer fail without an unhandled rejection; it still subscribes. */
function handled<T extends PromiseLike<unknown>>(result: T, onError: (error: unknown) => void): T {
	Promise.resolve(result).then(undefined, onError);
	return result;
}

/**
 * Subscribes to everything a conference's mirror is made of. The results only say that something
 * changed; `syncConference` reads the conference afresh, so a change arriving in pieces is read
 * whole.
 */
function watchConference({
	remote,
	conferenceId,
	onChange,
	onError
}: {
	remote: DelegatorClient;
	conferenceId: string;
	onChange: (conferenceId: string) => void;
	onError: (error: unknown) => void;
}) {
	const inConference = { where: { conferenceId: { eq: conferenceId } } };
	const ofConference = { where: { conference: { id: { eq: conferenceId } } } };
	const changed = () => onChange(conferenceId);

	const live = [
		remote.liveQuery.committees({
			__args: inConference,
			id: true,
			name: true,
			abbreviation: true,
			roles: { id: true }
		}),
		remote.liveQuery.committeeAgendaItems({
			__args: { where: { committee: { conferenceId: { eq: conferenceId } } } },
			id: true,
			title: true
		}),
		remote.liveQuery.conferenceRoles({
			__args: inConference,
			id: true,
			name: true,
			fontAwesomeIcon: true,
			chaseAccess: true
		}),
		remote.liveQuery.teamMembers({ __args: inConference, id: true, role: true, user: PERSON }),
		remote.liveQuery.delegations({ __args: inConference, id: true, assignedRole: { id: true } }),
		remote.liveQuery.delegationMembers({
			__args: ofConference,
			id: true,
			assignedCommittee: { id: true },
			participant: { id: true, nsaCardNumber: true },
			user: PERSON
		}),
		remote.liveQuery.singleParticipants({
			__args: ofConference,
			id: true,
			assignedRole: { id: true },
			user: PERSON
		}),
		remote.liveQuery.conferenceSupervisors({ __args: ofConference, id: true, user: PERSON }),
		// the accepted working papers; a new accepted version arrives in `versions`
		remote.liveQuery.papers({
			__args: {
				where: { type: 'WORKING_PAPER', delegation: { conferenceId: { eq: conferenceId } } }
			},
			id: true,
			versions: { id: true }
		})
	];
	const unsubscribes = live.map((result) => listen<unknown>(handled(result, onError), changed));
	return () => {
		for (const unsubscribe of unsubscribes) unsubscribe();
	};
}

const PERSON = { id: true, email: true, givenName: true, familyName: true } as const;

/** Reads one conference from DELEGATOR as it is now and writes it into CHASE. */
async function syncConference({
	remote,
	linkId,
	conferenceId
}: {
	remote: DelegatorClient;
	linkId: string;
	conferenceId: string;
}) {
	try {
		const inConference = { where: { conferenceId: { eq: conferenceId } } };
		const ofConference = { where: { conference: { id: { eq: conferenceId } } } };
		const [
			conference,
			committees,
			roles,
			teamMembers,
			delegationMembers,
			singleParticipants,
			supervisors
		] = await Promise.all([
			remote.query.conference({
				__args: { id: conferenceId },
				title: true,
				location: true,
				startConference: true,
				endConference: true
			}),
			readAll((page) =>
				remote.query.committees({
					__args: { ...inConference, ...page },
					id: true,
					name: true,
					abbreviation: true,
					agendaItems: { id: true, title: true },
					roles: { id: true }
				})
			),
			readAll((page) =>
				remote.query.conferenceRoles({
					__args: { ...inConference, ...page },
					id: true,
					kind: true,
					name: true,
					fontAwesomeIcon: true,
					chaseAccess: true,
					nation: { alpha2Code: true }
				})
			),
			readAll((page) =>
				remote.query.teamMembers({
					__args: { ...inConference, ...page },
					id: true,
					role: true,
					user: PERSON
				})
			),
			readAll((page) =>
				remote.query.delegationMembers({
					__args: { ...ofConference, ...page },
					id: true,
					assignedCommittee: { id: true },
					delegation: { id: true, assignedRole: { id: true } },
					participant: { id: true, nsaCardNumber: true },
					user: PERSON
				})
			),
			readAll((page) =>
				remote.query.singleParticipants({
					__args: { ...ofConference, ...page },
					id: true,
					assignedRole: { id: true },
					user: PERSON
				})
			),
			readAll((page) =>
				remote.query.conferenceSupervisors({
					__args: { ...ofConference, ...page },
					id: true,
					user: PERSON
				})
			)
		]);

		await reconcileConference(
			mirrorConference({
				conference: {
					id: conferenceId,
					title: conference.title,
					location: conference.location,
					startConference: conference.startConference,
					endConference: conference.endConference
				},
				committees,
				roles,
				teamMembers,
				delegationMembers,
				singleParticipants,
				supervisors
			})
		);
		// after the reconcile: a draft needs its committee, agenda item and seat in place
		await syncWorkingPapers({ remote, conferenceId });
		await db
			.update(schema.instanceLink)
			.set({ lastEventAt: new Date(), lastReconcileAt: new Date(), lastError: null })
			.where(eq(schema.instanceLink.id, linkId));
		instanceLinkPubsub.updated(linkId);
	} catch (error) {
		await recordError({ linkId, error });
	}
}

/**
 * Keeps DELEGATOR's public keys, which the scanners check nametags and cards against offline.
 * Read on every (re)connect: they only change when DELEGATOR rotates them.
 */
async function storeIdentityKey({ remote, linkId }: { remote: DelegatorClient; linkId: string }) {
	try {
		const published = await remote.query.signedCodeKeys({ kid: true, publicKey: true });
		const keys = published.map(({ kid, publicKey }) => ({ kid, publicKey }));
		const updated = await db
			.update(schema.instanceLink)
			.set({ remoteSigningKeys: keys })
			.where(
				and(
					eq(schema.instanceLink.id, linkId),
					sql`${schema.instanceLink.remoteSigningKeys} is distinct from ${JSON.stringify(keys)}::jsonb`
				)
			)
			.returning({ id: schema.instanceLink.id });
		if (updated.length > 0) instanceLinkPubsub.updated(linkId);
	} catch (error) {
		await recordError({ linkId, error });
	}
}

async function recordError({ linkId, error }: { linkId: string; error: unknown }) {
	console.error('[link] syncing from DELEGATOR failed', error);
	await db
		.update(schema.instanceLink)
		.set({ lastError: error instanceof Error ? error.message : String(error) })
		.where(eq(schema.instanceLink.id, linkId))
		.catch(() => undefined);
	instanceLinkPubsub.updated(linkId);
}
