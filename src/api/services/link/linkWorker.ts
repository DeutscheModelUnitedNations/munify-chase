import { db, schema } from '#api/db/db';
import { and, eq, sql } from 'drizzle-orm';
import {
	conferenceChange,
	openConferences,
	tablesToAskAgain,
	type ConferenceRow
} from './conferenceRows';
import { watchConferenceTables, type ConferenceTables } from './conferenceTables';
import { createDelegatorClient, type DelegatorClient } from './delegatorRemote';
import { joinTables } from './joinTables';
import { instanceLinkPubsub } from './linkPubsub';
import { linkAccessToken, linkConfig } from './linkAuth';
import { syncLinkRow } from './linkState';
import { createGate, handled } from './liveTable';
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
	title: true,
	location: true,
	startConference: true,
	endConference: true,
	state: true,
	assignmentReleased: true
} as const;

let running: { stop: () => void } | undefined;

function startLinkWorker() {
	running ??= runWorker();
}

function stopLinkWorker() {
	running?.stop();
	running = undefined;
}

/** On server start: brings the link's row in line with the configuration and starts syncing. */
export async function resumeLinkWorker() {
	if (await syncLinkRow()) startLinkWorker();
}

function runWorker() {
	let stopped = false;
	const cleanups: (() => void)[] = [];
	const stop = () => {
		stopped = true;
		for (const cleanup of cleanups.splice(0).reverse()) cleanup();
	};

	(async () => {
		if (!(await awaitLeadership(cleanups)) || stopped) return;

		const active = await activeLink();
		if (!active) return stop();
		const { config, link } = active;

		const conferences = new Map<string, ConferenceRow>();
		const watches = new Map<string, ConferenceTables>();
		/** Per conference, the ids rows pointed at that were missing and have been asked for again. */
		const askedAgain = new Map<string, Set<string>>();
		const timers = new Map<string, ReturnType<typeof setTimeout>>();
		cleanups.push(() => {
			for (const timer of timers.values()) clearTimeout(timer);
			for (const watch of watches.values()) watch.stop();
		});

		// A live query's answer may fail (DELEGATOR unreachable, a rule refusing): that is noted on the
		// link, never left to crash the app. A first answer is asked again, an update waits for the next.
		const failed = (error: unknown) => void recordError({ linkId: link.id, error });

		let reconnected = () => {};
		const remote: DelegatorClient = createDelegatorClient({
			url: config.remoteUrl,
			token: () => linkAccessToken(config),
			onError: failed,
			onConnected: () => {
				void storeIdentityKey({ remote, linkId: link.id });
				reconnected();
			}
		});
		cleanups.push(() => remote.dispose());

		/** Brings one conference's mirror up to what the tables hold, once they all answered. */
		/** A conference whose tables have all answered, with them. */
		const answered = (conferenceId: string) => {
			const watch = watches.get(conferenceId);
			const conference = conferences.get(conferenceId);
			return watch?.ready() && conference ? { watch, conference } : undefined;
		};

		const apply = async (conferenceId: string) => {
			const ready = answered(conferenceId);
			if (!ready) return;
			const { watch, conference } = ready;
			const { source, papers, missing } = joinTables({ conference, tables: watch.tables() });

			const { stale, stillMissing } = tablesToAskAgain({
				missing,
				asked: askedAgain.get(conferenceId) ?? new Set()
			});
			askedAgain.set(conferenceId, stillMissing);
			if (stale.length > 0) return watch.refresh(stale);

			await writeMirror({ conferenceId, source, papers });
		};

		const writeMirror = async ({
			conferenceId,
			source,
			papers
		}: { conferenceId: string } & Pick<ReturnType<typeof joinTables>, 'source' | 'papers'>) => {
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
		/** Conferences that ended or went away: their watch stops and CHASE keeps them as they are. */
		const release = (current: ReadonlyMap<string, ConferenceRow>) => {
			for (const [conferenceId, tables] of watches) {
				if (current.has(conferenceId)) continue;
				tables.stop();
				watches.delete(conferenceId);
				conferences.delete(conferenceId);
				void releaseConference(conferenceId).catch((error) =>
					recordError({ linkId: link.id, error })
				);
			}
		};

		const follow = (row: ConferenceRow) => {
			const change = conferenceChange({ before: conferences.get(row.id), row });
			conferences.set(row.id, row);
			const tables = watches.get(row.id);
			if (!tables) return void watches.set(row.id, watch(row.id));
			if (change.refresh) tables.refresh();
			if (change.write) schedule(row.id);
		};

		let unwatchConferences: (() => void) | undefined;
		const watchConferences = () => {
			unwatchConferences?.();
			const list = handled(remote.liveQuery.conferences(CONFERENCE), failed);
			unwatchConferences = list.subscribe((rows) => {
				if (!rows || stopped) return;
				const current = openConferences(rows);
				release(current);
				for (const row of current.values()) follow(row);
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

/**
 * Waits until this process holds the worker's lock, which the instance holding it now gives up
 * when it stops or dies. False where there is no database to hold it on.
 */
async function awaitLeadership(cleanups: (() => void)[]) {
	// a string under `drizzle.mock()`, which only `vite build` uses
	if (typeof db.$client === 'string') return false;
	const leadership = await db.$client.connect();
	cleanups.push(() => {
		leadership
			.query('select pg_advisory_unlock($1)', [LEADER_LOCK_KEY])
			.finally(() => leadership.release());
	});
	await leadership.query('select pg_advisory_lock($1)', [LEADER_LOCK_KEY]);
	return true;
}

/** The configured link and its row, or undefined while there is none. */
async function activeLink() {
	const config = linkConfig();
	const link = await db.query.instanceLink.findFirst({ columns: { id: true } });
	return config && link ? { config, link } : undefined;
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
