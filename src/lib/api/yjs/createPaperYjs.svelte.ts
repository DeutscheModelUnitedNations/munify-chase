/**
 * Per-paper Y.js client factory.
 *
 * Wires a Y.Doc to:
 *   - IndexedDB persistence — local-first, edits survive offline
 *   - Hocuspocus WebSocket sync to /api/docs — real-time co-editing
 *   - Awareness (y-protocols) — remote cursors / focus
 *
 * Exposes a Svelte 5 reactive `connectionState` and `synced` flag for the
 * sync badge. The CRDT auto-merges across offline/online transitions; no
 * manual queue or replay is needed on the client side.
 */

import * as Y from 'yjs';
import {
	HocuspocusProvider,
	HocuspocusProviderWebsocket,
	WebSocketStatus
} from '@hocuspocus/provider';
import { Awareness } from 'y-protocols/awareness';
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
import toast from 'svelte-french-toast';
import { m } from '$lib/paraglide/messages';
import { READ_ONLY_DOWNGRADE_STATELESS_MESSAGE } from './statelessMessages';

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
	/**
	 * Bearer access token to pass to the Hocuspocus server via the `auth`
	 * in-band message. Required for native/Tauri clients that cannot send
	 * session cookies cross-origin. Leave undefined for web clients (cookie
	 * auth happens at the WebSocket upgrade level).
	 */
	token?: string;
}

export function createPaperYjsClient(opts: CreateOptions): PaperYjsClient {
	const doc = new Y.Doc();
	const awareness = new Awareness(doc);

	let persistenceLoaded = $state(false);
	let wsSynced = $state(false);
	let connectionState = $state<YjsConnectionState>('connecting');

	// 1. Local persistence — hydrates synchronously then emits 'synced'.
	const idbPersistence = new IndexeddbPersistence(`chase-yjs-paper-${opts.paperId}`, doc);

	// 2. Hocuspocus provider. The paper id is sent in-band as the document
	// name, so the URL is just the endpoint. Build a ws:// or wss:// URL
	// directly from window.location to avoid a mutable URL.
	const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsUrl = `${wsProto}//${window.location.host}/api/docs`;

	// Track whether the server has made a definitive ruling (forbidden,
	// unauthorized, corrupt doc). In that case we must NOT reconnect.
	let terminalError = false;

	// Start disconnected: we connect only after IDB has fully synced so that
	// all WS updates (server content, peer deletions, etc.) are guaranteed to
	// be written to IndexedDB. If the WS connected before IDB was ready
	// (this.db === null in y-indexeddb), those updates would only live in
	// memory. On component remount the IDB would load a stale snapshot and the
	// offline edits that reference the missing WS-synced structures would become
	// pending Y.js ops — invisible until the next WS sync. By delaying the WS
	// connection until IDB is ready, every update is persisted from the start.
	const socket = new HocuspocusProviderWebsocket({
		url: wsUrl,
		autoConnect: false,
		onStatus: ({ status }) => {
			connectionState = terminalError ? 'error' : status;
			if (status !== WebSocketStatus.Connected) {
				wsSynced = false;
			}
		}
	});

	const wsProvider = new HocuspocusProvider({
		name: opts.paperId,
		document: doc,
		awareness,
		websocketProvider: socket,
		...(opts.token ? { token: opts.token } : {}),
		onSynced: ({ state }) => {
			wsSynced = state;
		},
		// The server rejected the document connection (onConnect hook threw):
		// authorization failure or corrupt stored state. Definitive ruling —
		// stop retrying.
		onAuthenticationFailed: ({ reason }) => {
			terminalError = true;
			connectionState = 'error';
			console.error('[yjs] server rejected paper connection', { paperId: opts.paperId, reason });
			socket.disconnect();
		},
		onClose: ({ event }) => {
			// 4403 = forbidden / permission revoked, 4401 = unauthorized upgrade.
			// Don't keep retrying these; the server has made a definitive ruling.
			if (event && (event.code === 4403 || event.code === 4401)) {
				terminalError = true;
				connectionState = 'error';
				socket.disconnect();
			}
		},
		// Server kept the connection open (read access remains) but revoked write
		// access. A reload is the simplest way to land the whole page — editor
		// controls, canEdit, everything — in a consistent read-only state,
		// instead of threading a live readOnly flag through the editor props.
		onStateless: ({ payload }) => {
			if (payload === READ_ONLY_DOWNGRADE_STATELESS_MESSAGE) {
				toast(m.yjsReadOnlyDowngrade());
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			}
		}
	});
	// With an explicitly-passed websocketProvider the provider does NOT
	// auto-attach (manageSocket is false) — without this call it never sends
	// its auth/sync handshake.
	wsProvider.attach();

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
			void socket.connect();
		}
	});

	// Wire the browser's `online` event so that coming back from offline
	// triggers an immediate reconnect instead of waiting for the socket's
	// exponential-backoff retry.
	function handleOnline() {
		if (!terminalError && !destroyed) {
			void socket.connect();
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
		awareness
	});

	// Broadcast extra identity metadata so peers can apply display rules.
	if (opts.meta) {
		awareness.setLocalStateField('userMeta', opts.meta);
	}

	// 4. Reactive remote-presence list (self excluded).
	let remotePresences = $state<RemotePresence[]>([]);

	function refreshPresences() {
		const states = awareness.getStates();
		const localId = awareness.clientID;
		remotePresences = [...states.entries()]
			.filter(([clientId]) => clientId !== localId)
			.map(([, state]) => state as RemotePresence)
			.filter((s) => !!s.user);
	}

	refreshPresences();
	awareness.on('change', refreshPresences);

	async function destroy(): Promise<void> {
		if (destroyed) return;
		destroyed = true;
		awareness.off('change', refreshPresences);
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
		try {
			wsProvider.destroy();
			socket.destroy();
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
