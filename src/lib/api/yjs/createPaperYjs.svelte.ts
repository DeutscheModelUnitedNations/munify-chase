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
	createAwarenessPresence,
	jsonToYDoc
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { createEmptyResolution } from '@deutschemodelunitednations/munify-resolution-editor';
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
	idbPersistence.once('synced', () => {
		// Seed the root structure only if the doc is truly empty (brand-new paper).
		// Doing this after IDB loads avoids the CRDT race where a pre-load seed's
		// Y.Array at clock 0 can randomly win over the existing IDB array at clock 0
		// (tie broken by random clientID), wiping the user's content.
		jsonToYDoc(doc, createEmptyResolution(''));
		persistenceLoaded = true;
	});

	// 2. WebSocket provider. y-websocket appends the room as a path segment;
	// our server also reads `room` from the query string. Build a ws:// or
	// wss:// URL directly from window.location to avoid a mutable URL.
	const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsUrl = `${wsProto}//${window.location.host}/api/yjs`;

	const wsProvider = new WebsocketProvider(wsUrl, opts.paperId, doc, {
		params: { room: opts.paperId },
		connect: navigator.onLine
	});

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
			wsProvider.shouldConnect = false;
			connectionState = 'error';
		}
	});

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

	let destroyed = false;
	async function destroy(): Promise<void> {
		if (destroyed) return;
		destroyed = true;
		wsProvider.awareness.off('change', refreshPresences);
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
