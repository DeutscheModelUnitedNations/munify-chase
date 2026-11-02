import { db, schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import { createDelegatorClient, type DelegatorClient } from './delegatorRemote';
import { instanceLinkPubsub } from './linkPubsub';
import { openLinkToken } from './linkTokens';
import { mirrorConference } from './mirror';
import { reconcileConference, releaseConference } from './reconcile';

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
			leadership.query('select pg_advisory_unlock($1)', [LEADER_LOCK_KEY]).finally(() => leadership.release());
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

		const remote: DelegatorClient = createDelegatorClient({
			url: link.remoteUrl,
			token: openLinkToken(link.outboundToken),
			onConnected: () => {
				for (const conferenceId of watchers.keys()) schedule(conferenceId);
			}
		});
		cleanups.push(() => remote.dispose());

		const schedule = (conferenceId: string) => {
			clearTimeout(timers.get(conferenceId));
			timers.set(
				conferenceId,
				setTimeout(() => {
					timers.delete(conferenceId);
					if (!stopped) void syncConference({ remote, linkId: link.id, conferenceId });
				}, DEBOUNCE_MS)
			);
		};

		// DELEGATOR shows the link the conferences it mirrors; a public one that has ended may
		// still be readable, so the state decides
		const conferences = remote.liveQuery.conferences({ id: true, state: true });
		const unsubscribe = conferences.subscribe((list) => {
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
					watchers.set(conferenceId, watchConference({ remote, conferenceId, onChange: schedule }));
				}
				schedule(conferenceId);
			}
		});
		cleanups.push(unsubscribe);
	})().catch((error) => {
		console.error('[link] the link worker stopped', error);
		stop();
		running = undefined;
	});

	return { stop };
}

/**
 * Subscribes to everything a conference's mirror is made of. The results only say that something
 * changed; `syncConference` reads the conference afresh, so a change arriving in pieces is read
 * whole.
 */
function watchConference({
	remote,
	conferenceId,
	onChange
}: {
	remote: DelegatorClient;
	conferenceId: string;
	onChange: (conferenceId: string) => void;
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
			user: PERSON
		}),
		remote.liveQuery.singleParticipants({
			__args: ofConference,
			id: true,
			assignedRole: { id: true },
			user: PERSON
		}),
		remote.liveQuery.conferenceSupervisors({ __args: ofConference, id: true, user: PERSON })
	];
	const unsubscribes = live.map((result) => result.subscribe(changed));
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
		const [conference, committees, roles, teamMembers, delegationMembers, singleParticipants, supervisors] =
			await Promise.all([
				remote.query.conference({
					__args: { id: conferenceId },
					title: true,
					location: true,
					startConference: true,
					endConference: true
				}),
				remote.query.committees({
					__args: inConference,
					id: true,
					name: true,
					abbreviation: true,
					agendaItems: { id: true, title: true },
					roles: { id: true }
				}),
				remote.query.conferenceRoles({
					__args: inConference,
					id: true,
					kind: true,
					name: true,
					fontAwesomeIcon: true,
					chaseAccess: true,
					nation: { alpha2Code: true }
				}),
				remote.query.teamMembers({ __args: inConference, id: true, role: true, user: PERSON }),
				remote.query.delegationMembers({
					__args: ofConference,
					id: true,
					assignedCommittee: { id: true },
					delegation: { id: true, assignedRole: { id: true } },
					user: PERSON
				}),
				remote.query.singleParticipants({
					__args: ofConference,
					id: true,
					assignedRole: { id: true },
					user: PERSON
				}),
				remote.query.conferenceSupervisors({ __args: ofConference, id: true, user: PERSON })
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
				committees: Array.from(committees),
				roles: Array.from(roles),
				teamMembers: Array.from(teamMembers),
				delegationMembers: Array.from(delegationMembers),
				singleParticipants: Array.from(singleParticipants),
				supervisors: Array.from(supervisors)
			})
		);
		await db
			.update(schema.instanceLink)
			.set({ lastEventAt: new Date(), lastReconcileAt: new Date(), lastError: null })
			.where(eq(schema.instanceLink.id, linkId));
		instanceLinkPubsub.updated(linkId);
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
