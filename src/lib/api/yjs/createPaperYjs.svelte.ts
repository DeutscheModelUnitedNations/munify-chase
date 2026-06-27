/**
 * Per-paper Y.js client factory.
 *
 * Wires a Y.Doc to:
 *   - IndexedDB persistence — local-first, edits survive offline
 *   - WebSocket sync to /api/yjs?room=<paperId> — real-time co-editing
 *   - Awareness (y-protocols) — remote cursors / focus
 *
 * Exposes a Svelte 5 reactive `connectionState` and `synced` flag for the
 * sync badge. The CRDT auto-merges across offline/online transitions; no
 * manual queue or replay is needed on the client side.
 */

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import {
	createYjsStore,
	createAwarenessPresence
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import type {
	ResolutionStore,
	PresenceAdapter,
	PresenceUser
} from '@deutschemodelunitednations/munify-resolution-editor';

export type YjsConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

/** Extra identity fields broadcast via awareness for presence display. */
export interface PresenceUserMeta {
	conferenceUserType: 'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR';
	/** Nation display name (for DELEGATE / NON_STATE_ACTOR). */
	nationName?: string | null;
	/** ISO alpha-2 code for flag rendering. */
	alpha2Code?: string | null;
	/** ISO alpha-3 code for translated name lookup on the viewer side. */
	alpha3Code?: string | null;
}

/** A remote peer's awareness state as seen by this client. */
export interface RemotePresence {
	user: PresenceUser;
	userMeta?: PresenceUserMeta;
}

export interface PaperYjsClient {
	doc: Y.Doc;
	store: ResolutionStore;
	presence: PresenceAdapter;
	/** Reactive: true once IndexedDB has hydrated. */
	get persistenceLoaded(): boolean;
	/** Reactive: true once WebSocket has completed initial sync. */
	get wsSynced(): boolean;
	/** Reactive: current WS state. */
	get connectionState(): YjsConnectionState;
	/** Reactive: remote peers currently in the awareness session (self excluded). */
	get remotePresences(): RemotePresence[];
	/** Tear down providers, persist, destroy doc. Returns once flushed to IDB. */
	destroy(): Promise<void>;
}

interface CreateOptions {
	paperId: string;
	user: PresenceUser;
	/** Identity metadata to broadcast via awareness for presence display. */
	meta?: PresenceUserMeta;
}

export function createPaperYjsClient(opts: CreateOptions): PaperYjsClient {
	const doc = new Y.Doc();

	let persistenceLoaded = $state(false);
	let wsSynced = $state(false);
	let connectionState = $state<YjsConnectionState>('connecting');

	// 1. Local persistence — hydrates synchronously then emits 'synced'.
	const idbPersistence = new IndexeddbPersistence(`chase-yjs-paper-${opts.paperId}`, doc);

	// 2. WebSocket provider. y-websocket appends the room as a path segment;
	// our server also reads `room` from the query string. Build a ws:// or
	// wss:// URL directly from window.location to avoid a mutable URL.
	const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsUrl = `${wsProto}//${window.location.host}/api/yjs`;

	// Start disconnected: we connect only after IDB has fully synced so that
	// all WS updates (server content, peer deletions, etc.) are guaranteed to
	// be written to IndexedDB. If the WS connected before IDB was ready
	// (this.db === null in y-indexeddb), those updates would only live in
	// memory. On component remount the IDB would load a stale snapshot and the
	// offline edits that reference the missing WS-synced structures would become
	// pending Y.js ops — invisible until the next WS sync. By delaying the WS
	// connection until IDB is ready, every update is persisted from the start.
	const wsProvider = new WebsocketProvider(wsUrl, opts.paperId, doc, {
		params: { room: opts.paperId },
		connect: false
	});

	// Track whether a terminal server error (4403/4401/4500) has been received.
	// In that case we must NOT reconnect — the server made a definitive ruling.
	let terminalError = false;

	wsProvider.on('status', (event: { status: 'connecting' | 'connected' | 'disconnected' }) => {
		connectionState = event.status;
		if (event.status !== 'connected') {
			wsSynced = false;
		}
	});

	wsProvider.on('sync', (isSynced: boolean) => {
		wsSynced = isSynced;
	});

	wsProvider.on('connection-error', () => {
		connectionState = 'error';
	});

	wsProvider.on('connection-close', (closeEvent: { code: number } | null) => {
		// 4403 = forbidden, 4500 = corrupt doc, 4401 = unauthorized. Don't keep
		// retrying these; the server has made a definitive ruling.
		if (
			closeEvent &&
			(closeEvent.code === 4403 || closeEvent.code === 4500 || closeEvent.code === 4401)
		) {
			terminalError = true;
			wsProvider.shouldConnect = false;
			connectionState = 'error';
		}
	});

	let destroyed = false;

	// Connect the WS once IDB has fully loaded. This guarantees all subsequent
	// WS updates are saved to IndexedDB. We do NOT pre-seed with an empty
	// resolution here — doing so would race with the server's Y.applyUpdate: both
	// would write the root Y.Map keys at the same clock depth, and tie-breaking
	// is random (clientId), so the empty arrays would win ~50% of the time and
	// wipe visible content for fresh browsers.
	idbPersistence.whenSynced.then(() => {
		if (destroyed) return; // client was torn down before IDB finished
		persistenceLoaded = true;

		if (!terminalError) {
			// connect() unconditionally sets shouldConnect = true internally, so
			// this works regardless of whether we started online or offline.
			wsProvider.connect();
		}
	});

	// Wire the browser's `online` event so that coming back from offline
	// triggers an immediate reconnect instead of waiting for y-websocket's
	// exponential-backoff retry (which y-websocket does NOT self-resume on the
	// online event — it has no window.online listener of its own).
	function handleOnline() {
		if (!terminalError) {
			// connect() sets shouldConnect = true and calls setupWS() only if
			// no connection is already pending (ws === null). Safe to call
			// unconditionally: if a pending attempt is in flight it's a no-op
			// and that attempt will succeed now that we're online.
			wsProvider.connect();
		}
	}
	function handleOffline() {
		connectionState = 'disconnected';
	}
	window.addEventListener('online', handleOnline);
	window.addEventListener('offline', handleOffline);

	// 3. Editor store + presence adapter.
	const store = createYjsStore(doc);
	const presence = createAwarenessPresence({
		user: opts.user,
		awareness: wsProvider.awareness
	});

	// Broadcast extra identity metadata so peers can apply display rules.
	if (opts.meta) {
		wsProvider.awareness.setLocalStateField('userMeta', opts.meta);
	}

	// 4. Reactive remote-presence list (self excluded).
	let remotePresences = $state<RemotePresence[]>([]);

	function refreshPresences() {
		const states = wsProvider.awareness.getStates();
		const localId = wsProvider.awareness.clientID;
		remotePresences = [...states.entries()]
			.filter(([clientId]) => clientId !== localId)
			.map(([, state]) => state as RemotePresence)
			.filter((s) => !!s.user);
	}

	refreshPresences();
	wsProvider.awareness.on('change', refreshPresences);

	async function destroy(): Promise<void> {
		if (destroyed) return;
		destroyed = true;
		wsProvider.awareness.off('change', refreshPresences);
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
		try {
			wsProvider.disconnect();
		} catch {
			/* noop */
		}
		try {
			await idbPersistence.destroy();
		} catch {
			/* noop */
		}
		store.destroy();
		doc.destroy();
	}

	return {
		doc,
		store,
		presence,
		get persistenceLoaded() {
			return persistenceLoaded;
		},
		get wsSynced() {
			return wsSynced;
		},
		get connectionState() {
			return connectionState;
		},
		get remotePresences() {
			return remotePresences;
		},
		destroy
	};
}
