/**
 * Minimal Y.js sync server over WebSocket.
 *
 * Implements the y-protocols sync v2 + awareness framing — the same wire
 * format `y-websocket` clients speak — without depending on the
 * `y-websocket` server package.
 *
 * Authorization happens at upgrade time. Read-only sessions ignore
 * client-sent doc updates and only forward awareness.
 */

import type { WebSocket } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { db } from '../db/db';
import { acquirePaperDoc, CorruptYjsStateError } from './server';

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const MESSAGE_AUTH = 2;
const MESSAGE_QUERY_AWARENESS = 3;

interface AuthResult {
	allowed: boolean;
	canWrite: boolean;
}

/**
 * Status-aware permission check. Mirrors §3.2 of the resolution feature plan:
 *   - Team (chair/admin): always allowed to write, any status.
 *   - paperEditor: write while WORKING_PAPER / SUBMITTED, read after.
 *   - Anyone else in the conference: read-only.
 */
async function authorize(paperId: string, userSub: string | undefined): Promise<AuthResult> {
	if (!userSub) return { allowed: false, canWrite: false };

	const paper = await db.query.resolutionPaper.findFirst({ where: { id: paperId } });
	if (!paper || paper.deletedAt) return { allowed: false, canWrite: false };

	const chair = await db.query.conferenceUser.findFirst({
		where: {
			conference: { committees: { id: paper.committeeId } },
			user: { id: userSub },
			conferenceUserType: { in: ['ADMIN', 'TEAM'] }
		}
	});
	if (chair) return { allowed: true, canWrite: true };

	if (paper.status === 'WORKING_PAPER' || paper.status === 'SUBMITTED') {
		const editor = await db.query.paperEditor.findFirst({
			where: {
				paperId,
				conferenceUser: { user: { id: userSub } }
			}
		});
		if (editor) return { allowed: true, canWrite: true };
	}

	// Anyone in the conference can read.
	const participant = await db.query.conferenceUser.findFirst({
		where: {
			conference: { committees: { id: paper.committeeId } },
			user: { id: userSub }
		}
	});
	if (participant) return { allowed: true, canWrite: false };

	return { allowed: false, canWrite: false };
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
	// CRITICAL: attach buffering listeners synchronously, before any awaits.
	// `ws` does not queue 'message' events received before a listener exists.
	// On a returning navigation the client's SyncStep1 can race past our setup
	// awaits and reach the socket before we'd be ready, leaving the client
	// hanging forever.
	const earlyMessages: Buffer[] = [];
	const earlyMessageHandler = (data: Buffer) => earlyMessages.push(data);
	ws.on('message', earlyMessageHandler);

	let earlyClosed = false;
	const earlyCloseHandler = () => {
		earlyClosed = true;
	};
	ws.on('close', earlyCloseHandler);
	ws.on('error', earlyCloseHandler);

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
		ws.close(4403, 'Forbidden');
		return;
	}
	if (earlyClosed) return;

	let docHandle: { doc: Y.Doc; awareness: awarenessProtocol.Awareness; release: () => void };
	try {
		docHandle = await acquirePaperDoc(paperId);
	} catch (err) {
		if (err instanceof CorruptYjsStateError) {
			// A3: hard fail. Surface to the client with a distinct code so the
			// UI can show a recovery prompt rather than retrying forever.
			console.error('[yjs] corrupt doc — refusing to open room', { paperId });
			try {
				ws.close(4500, 'Document corrupt');
			} catch {
				/* noop */
			}
			return;
		}
		console.error('[yjs] acquirePaperDoc failed', { paperId, err });
		try {
			ws.close(1011, 'Failed to load document');
		} catch {
			/* noop */
		}
		return;
	}
	if (earlyClosed) {
		docHandle.release();
		return;
	}
	const { doc, awareness, release } = docHandle;

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

	const controlledClientIds = new Set<number>();

	const onAwarenessUpdate = (
		{ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
		origin: unknown
	) => {
		if (origin === ws) {
			for (const id of added) controlledClientIds.add(id);
			for (const id of updated) controlledClientIds.add(id);
			for (const id of removed) controlledClientIds.delete(id);
			return;
		}
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

	const handleMessage = (data: Buffer) => {
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
					return;
				default:
					return;
			}
		} catch (err) {
			console.error('[yjs] message handling error', err);
		}
	};

	// Swap in the real handler and drain anything that arrived during async init.
	ws.off('message', earlyMessageHandler);
	ws.on('message', handleMessage);
	for (const buffered of earlyMessages) {
		handleMessage(buffered);
	}
	earlyMessages.length = 0;

	let closed = false;
	const onClose = () => {
		if (closed) return;
		closed = true;
		doc.off('update', onDocUpdate);
		awareness.off('update', onAwarenessUpdate);
		if (controlledClientIds.size > 0) {
			awarenessProtocol.removeAwarenessStates(awareness, Array.from(controlledClientIds), ws);
			controlledClientIds.clear();
		}
		release();
	};
	ws.off('close', earlyCloseHandler);
	ws.off('error', earlyCloseHandler);
	ws.on('close', onClose);
	ws.on('error', onClose);
}
