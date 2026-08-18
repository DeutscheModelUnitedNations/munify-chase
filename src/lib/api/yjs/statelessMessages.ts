/**
 * Stateless message payloads exchanged over the Hocuspocus WebSocket
 * connection (`connection.sendStateless` / provider `onStateless`), shared
 * between src/api/yjs/server.ts and createPaperYjs.svelte.ts.
 */

/** Sent to a still-connected client when write access is revoked mid-session but read access remains. */
export const READ_ONLY_DOWNGRADE_STATELESS_MESSAGE = 'read-only-downgrade';
