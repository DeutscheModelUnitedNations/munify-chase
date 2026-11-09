import { db, schema } from '#api/db/db';
import { and, eq, sql } from 'drizzle-orm';
import { watchConferenceTables, type ConferenceTables } from './conferenceTables';
import { createDelegatorClient, type DelegatorClient } from './delegatorRemote';
import { joinTables } from './joinTables';
import { instanceLinkPubsub } from './linkPubsub';
import { openLinkToken } from './linkTokens';
import { createGate, handled, listen } from './liveTable';
import { mirrorConference } from './mirror';
import { reconcileConference, releaseConference } from './reconcile';
import { syncWorkingPapers } from './workingPaperSync';

/**
 * The link worker (`docs/plans/delegator-link.md`): mirrors every DELEGATOR conference that has not
 * ended. It runs in one app process at a time (a Postgres advisory lock) and keeps DELEGATOR's
 * tables of each conference in memory through live queries (`conferenceTables.ts`): a change
 * answers with the rows of the table it touched, the mirror is worked out from memory, and only the
 * rows that differ from CHASE's are written. The stream's (re)connect asks every table again,
 * since changes may have been missed while it was down. There is no timer: a dead stream is
 * noticed by the transport, and the reconnect catches up.
 */

/** pg advisory lock key for the worker, any constant no other lock uses. */
const LEADER_LOCK_KEY = 4_812_771;
/** A change usually touches several tables at once; one write after it is enough. */
const DEBOUNCE_MS = 400;
/** First answers awaited at once, so starting up does not ask DELEGATOR for everything at once. */
const FIRST_ANSWERS_AT_ONCE = 4;

const CONFERENCE = {
	id: true,
	title: true,
	location: true,
	startConference: true,
	endConference: true,
	state: true,
	assignmentReleased: true
} as const;

interface ConferenceRow {
	id: string;
	title: string;
	location?: string | null;
	startConference: Date;
	endConference: Date;
	state: string;
	assignmentReleased: boolean;
}

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

		const conferences = new Map<string, ConferenceRow>();
		const watches = new Map<string, ConferenceTables>();
		/** Per conference, the ids rows pointed at that were missing and have been asked for again. */
		const askedAgain = new Map<string, Set<string>>();
		const timers = new Map<string, ReturnType<typeof setTimeout>>();
		cleanups.push(() => {
			for (const timer of timers.values()) clearTimeout(timer);
			for (const watch of watches.values()) watch.stop();
		});

		let reconnected = () => {};
		const remote: DelegatorClient = createDelegatorClient({
			url: link.remoteUrl,
			token: openLinkToken(link.outboundToken),
			onConnected: () => {
				void storeIdentityKey({ remote, linkId: link.id });
				reconnected();
			}
		});
		cleanups.push(() => remote.dispose());

		// A live query's first answer may fail (DELEGATOR unreachable, a rule refusing): that is noted
		// on the link and asked again on the next (re)connect, never left to crash the app.
		const failed = (error: unknown) => void recordError({ linkId: link.id, error });

		/** Brings one conference's mirror up to what the tables hold, once they all answered. */
		const apply = async (conferenceId: string) => {
			const watch = watches.get(conferenceId);
			const conference = conferences.get(conferenceId);
			if (!watch || !conference || !watch.ready()) return;
			const { source, papers, missing } = joinTables({ conference, tables: watch.tables() });

			// a row pointing at one its table does not hold yet: that table is asked again once, and
			// the mirror waits for the answer rather than dropping the person meanwhile
			const asked = askedAgain.get(conferenceId) ?? new Set<string>();
			const again = (ids: string[]) => ids.some((id) => !asked.has(id));
			const stale = [
				...(again(missing.users) ? (['users'] as const) : []),
				...(again(missing.participants) ? (['participants'] as const) : []),
				...(again(missing.delegations) ? (['delegations'] as const) : [])
			];
			const stillMissing = [...missing.users, ...missing.participants, ...missing.delegations];
			askedAgain.set(conferenceId, new Set(stillMissing));
			if (stale.length > 0) {
				watch.refresh(stale);
				return;
			}

			try {
				await reconcileConference(mirrorConference(source));
				// after the mirror: a draft needs its committee, agenda item and seat in place
				await syncWorkingPapers({ remote, conferenceId, papers });
				await db
					.update(schema.instanceLink)
					.set({ lastEventAt: new Date(), lastReconcileAt: new Date(), lastError: null })
					.where(eq(schema.instanceLink.id, link.id));
				instanceLinkPubsub.updated(link.id);
			} catch (error) {
				await recordError({ linkId: link.id, error });
			}
		};

		// One write per conference at a time: two at once would both create what is new. A change
		// meanwhile asks for one more pass afterwards.
		const applying = new Set<string>();
		const again = new Set<string>();
		const run = (conferenceId: string) => {
			if (applying.has(conferenceId)) {
				again.add(conferenceId);
				return;
			}
			applying.add(conferenceId);
			void apply(conferenceId).finally(() => {
				applying.delete(conferenceId);
				if (again.delete(conferenceId) && !stopped) run(conferenceId);
			});
		};

		const schedule = (conferenceId: string) => {
			clearTimeout(timers.get(conferenceId));
			timers.set(
				conferenceId,
				setTimeout(() => {
					timers.delete(conferenceId);
					if (!stopped) run(conferenceId);
				}, DEBOUNCE_MS)
			);
		};

		const gate = createGate(FIRST_ANSWERS_AT_ONCE);
		const watch = (conferenceId: string) =>
			watchConferenceTables({
				remote,
				conferenceId,
				onChange: () => schedule(conferenceId),
				onError: failed,
				gate
			});

		// DELEGATOR shows the link the conferences it mirrors; a public one that has ended may still be
		// readable, so the state decides. Set up again on every (re)connect: a first answer that failed
		// (the other side was away) leaves no watch behind otherwise.
		let unwatchConferences: (() => void) | undefined;
		const watchConferences = () => {
			unwatchConferences?.();
			const list = handled(remote.liveQuery.conferences(CONFERENCE), failed);
			unwatchConferences = listen(list, (rows) => {
				if (!rows || stopped) return;
				const current = new Map(
					Array.from(rows)
						.filter((row) => row.state !== 'POST')
						.map((row): [string, ConferenceRow] => [
							row.id,
							{
								id: row.id,
								title: row.title,
								location: row.location,
								startConference: row.startConference,
								endConference: row.endConference,
								state: row.state,
								assignmentReleased: row.assignmentReleased
							}
						])
				);
				for (const [conferenceId, tables] of watches) {
					if (current.has(conferenceId)) continue;
					tables.stop();
					watches.delete(conferenceId);
					conferences.delete(conferenceId);
					void releaseConference(conferenceId).catch((error) =>
						recordError({ linkId: link.id, error })
					);
				}
				for (const [conferenceId, row] of current) {
					const before = conferences.get(conferenceId);
					conferences.set(conferenceId, row);
					const tables = watches.get(conferenceId);
					if (!tables) {
						watches.set(conferenceId, watch(conferenceId));
						continue;
					}
					// what the link may read follows the release, without the tables changing
					if (before && before.assignmentReleased !== row.assignmentReleased) tables.refresh();
					if (!before || !sameConference(before, row)) schedule(conferenceId);
				}
			});
		};
		// A stream that broke takes the subscriptions on it along, so every table is asked again
		reconnected = () => {
			for (const tables of watches.values()) tables.refresh();
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

function sameConference(a: ConferenceRow, b: ConferenceRow) {
	return (
		a.title === b.title &&
		(a.location ?? null) === (b.location ?? null) &&
		a.startConference.getTime() === b.startConference.getTime() &&
		a.endConference.getTime() === b.endConference.getTime() &&
		a.state === b.state &&
		a.assignmentReleased === b.assignmentReleased
	);
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
