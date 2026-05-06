/**
 * Minimal Y.js sync server over WebSocket.
 *
 * Implements the y-protocols sync v2 + awareness framing — the same wire
 * format `y-websocket` clients speak — without depending on the
 * `y-websocket` server package (which ships a CLI binary we don't need).
 *
 * Authorization is performed at upgrade time using the same status-aware
 * rules as the old GraphQL `updatePaperContent` mutation. Read-only
 * sessions ignore client-sent doc updates and only forward awareness.
 */

import type { WebSocket } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { db } from '../db/db';
import { acquirePaperDoc } from './server';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const MESSAGE_AUTH = 2;
const MESSAGE_QUERY_AWARENESS = 3;

interface AuthResult {
	allowed: boolean;
	canWrite: boolean;
}

/**
 * Per-paper awareness instance; sessions on the same paper share state.
 */
const awarenessByPaper = new Map<
	string,
	{ awareness: awarenessProtocol.Awareness; refCount: number }
>();

function getOrCreateAwareness(paperId: string, doc: Y.Doc) {
	let entry = awarenessByPaper.get(paperId);
	if (!entry) {
		entry = { awareness: new awarenessProtocol.Awareness(doc), refCount: 0 };
		awarenessByPaper.set(paperId, entry);
	}
	entry.refCount++;
	return entry.awareness;
}

function releaseAwareness(paperId: string) {
	const entry = awarenessByPaper.get(paperId);
	if (!entry) return;
	entry.refCount--;
	if (entry.refCount <= 0) {
		entry.awareness.destroy();
		awarenessByPaper.delete(paperId);
	}
}

/**
 * Mirror of the status-aware permission rules in the old
 * `updatePaperContent` mutation.
 */
async function authorize(paperId: string, userSub: string | undefined): Promise<AuthResult> {
	if (!userSub) return { allowed: false, canWrite: false };

	const paper = await db.query.resolutionPaper.findFirst({ where: { id: paperId } });
	if (!paper) return { allowed: false, canWrite: false };

	if (paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE') {
		const chair = await db.query.conferenceUser.findFirst({
			where: {
				conference: { committees: { id: paper.committeeId } },
				user: { id: userSub },
				conferenceUserType: { in: ['ADMIN', 'TEAM'] }
			}
		});
		return { allowed: true, canWrite: !!chair };
	}

	if (paper.status === 'SUBMITTED' || paper.status === 'WORKING_PAPER') {
		const chair = await db.query.conferenceUser.findFirst({
			where: {
				conference: { committees: { id: paper.committeeId } },
				user: { id: userSub },
				conferenceUserType: { in: ['ADMIN', 'TEAM'] }
			}
		});
		if (chair && paper.status === 'SUBMITTED') return { allowed: true, canWrite: true };

		const editor = await db.query.paperEditor.findFirst({
			where: {
				paperId,
				conferenceUser: { user: { id: userSub } }
			}
		});
		return { allowed: true, canWrite: !!editor };
	}

	return { allowed: true, canWrite: false };
}

function send(ws: WebSocket, bytes: Uint8Array) {
	try {
		ws.send(bytes);
	} catch {
		// socket likely closed; ignore
	}
}

/**
 * Open a Y.js sync room session on an authenticated WebSocket.
 */
export async function openYjsRoom(
	ws: WebSocket,
	paperId: string,
	userSub: string | undefined
): Promise<void> {
	let auth: AuthResult;
	try {
		auth = await authorize(paperId, userSub);
	} catch (err) {
		console.error('[yjs] authorize failed', { paperId, err });
		try {
			ws.close(1011, 'Internal error during authorization');
		} catch {
			/* noop */
		}
		return;
	}
	if (!auth.allowed) {
		console.warn('[yjs] connection forbidden', { paperId, hasUserSub: !!userSub });
		ws.close(4403, 'Forbidden');
		return;
	}

	let docHandle: { doc: Y.Doc; release: () => void };
	try {
		docHandle = await acquirePaperDoc(paperId);
	} catch (err) {
		console.error('[yjs] acquirePaperDoc failed', { paperId, err });
		try {
			ws.close(1011, 'Failed to load document');
		} catch {
			/* noop */
		}
		return;
	}
	const { doc, release } = docHandle;
	const awareness = getOrCreateAwareness(paperId, doc);

	// Send initial sync step 1.
	{
		const encoder = encoding.createEncoder();
		encoding.writeVarUint(encoder, MESSAGE_SYNC);
		syncProtocol.writeSyncStep1(encoder, doc);
		send(ws, encoding.toUint8Array(encoder));
	}

	// Send initial awareness state to the new client.
	{
		const states = awareness.getStates();
		if (states.size > 0) {
			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(states.keys()))
			);
			send(ws, encoding.toUint8Array(encoder));
		}
	}

	const onDocUpdate = (update: Uint8Array, origin: unknown) => {
		if (origin === ws) return;
		const encoder = encoding.createEncoder();
		encoding.writeVarUint(encoder, MESSAGE_SYNC);
		syncProtocol.writeUpdate(encoder, update);
		send(ws, encoding.toUint8Array(encoder));
	};
	doc.on('update', onDocUpdate);

	const onAwarenessUpdate = (
		{ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
		origin: unknown
	) => {
		if (origin === ws) return;
		const changedClients = added.concat(updated).concat(removed);
		const encoder = encoding.createEncoder();
		encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
		encoding.writeVarUint8Array(
			encoder,
			awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
		);
		send(ws, encoding.toUint8Array(encoder));
	};
	awareness.on('update', onAwarenessUpdate);

	ws.on('message', (data: Buffer) => {
		try {
			const decoder = decoding.createDecoder(new Uint8Array(data));
			const messageType = decoding.readVarUint(decoder);
			switch (messageType) {
				case MESSAGE_SYNC: {
					if (auth.canWrite) {
						const responseEncoder = encoding.createEncoder();
						encoding.writeVarUint(responseEncoder, MESSAGE_SYNC);
						syncProtocol.readSyncMessage(decoder, responseEncoder, doc, ws);
						if (encoding.length(responseEncoder) > 1) {
							send(ws, encoding.toUint8Array(responseEncoder));
						}
					} else {
						// Read-only: respond to sync-step1 with our state, drop the rest.
						const syncMessageType = decoding.readVarUint(decoder);
						if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
							const sv = decoding.readVarUint8Array(decoder);
							const responseEncoder = encoding.createEncoder();
							encoding.writeVarUint(responseEncoder, MESSAGE_SYNC);
							syncProtocol.writeSyncStep2(responseEncoder, doc, sv);
							send(ws, encoding.toUint8Array(responseEncoder));
						}
					}
					return;
				}
				case MESSAGE_AWARENESS: {
					awarenessProtocol.applyAwarenessUpdate(
						awareness,
						decoding.readVarUint8Array(decoder),
						ws
					);
					return;
				}
				case MESSAGE_QUERY_AWARENESS: {
					// Client asking for the current awareness state.
					const states = awareness.getStates();
					if (states.size === 0) return;
					const responseEncoder = encoding.createEncoder();
					encoding.writeVarUint(responseEncoder, MESSAGE_AWARENESS);
					encoding.writeVarUint8Array(
						responseEncoder,
						awarenessProtocol.encodeAwarenessUpdate(awareness, Array.from(states.keys()))
					);
					send(ws, encoding.toUint8Array(responseEncoder));
					return;
				}
				case MESSAGE_AUTH:
					// y-websocket sends auth messages but we authenticate at upgrade —
					// nothing to do here.
					return;
				default:
					return;
			}
		} catch (err) {
			console.error('[yjs] message handling error', err);
		}
	});

	const onClose = () => {
		doc.off('update', onDocUpdate);
		awareness.off('update', onAwarenessUpdate);
		awarenessProtocol.removeAwarenessStates(awareness, [awareness.clientID], ws);
		release();
		releaseAwareness(paperId);
	};
	ws.on('close', onClose);
	ws.on('error', onClose);
}
