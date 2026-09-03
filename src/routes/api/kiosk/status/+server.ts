import { db } from '$api/db/db';
import { isValidNanoid } from '$lib/helpers/nanoid';
import type { RequestHandler } from './$types';

// Unauthenticated + hits the DB on every call, so it's rate-limited per
// client IP. Real traffic is one paired Pi polling every PROVISION_PROBE_
// INTERVAL (30s default) — generous headroom above that for NATted venues
// where many displays can share one public IP.
const RATE_LIMIT_WINDOW_MS = 1000 * 60;
const RATE_LIMIT_MAX = 60;
// In-memory only (matches the pattern in api/handlers/ai.ts); IPs are
// attacker-controlled unlike that handler's userId keys, so entries are
// pruned as they expire rather than left to accumulate forever.
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
	const now = Date.now();
	for (const [key, entry] of requestCounts) {
		if (now > entry.resetAt) requestCounts.delete(key);
	}

	const entry = requestCounts.get(ip);
	if (!entry || now > entry.resetAt) {
		requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}
	if (entry.count >= RATE_LIMIT_MAX) return true;
	entry.count++;
	return false;
}

/**
 * Unauthenticated existence check for a single displayDevice row, polled
 * directly by the Pi's Python helper (chase-kiosk-helper.py) — not the
 * browser, which already gets this live over GraphQL. The helper needs it
 * outside any session: it has to know whether to give up on its *own*
 * refresh token before it necessarily has one worth authenticating with.
 *
 * No auth, deliberately: this only ever answers "does this specific id
 * exist", nothing else — no different a disclosure than the id itself,
 * which is already shown on-screen as a pairing QR code, and device ids are
 * unguessable 30-char nanoids (see helpers/nanoid.ts), so there's nothing
 * to enumerate. Bypasses the GraphQL/ability layer entirely on purpose —
 * same reasoning as /api/kiosk/session, which also does its own thing
 * outside a normal session.
 *
 * Deliberately does NOT report `revoked` — only existence. Revocation and
 * deletion are meant to behave differently for the Pi: a revoked-but-still-
 * present device keeps its refresh token (so restoring it in /app/displays
 * needs no re-pairing) and the browser's own live query already shows the
 * "revoked" screen for that case. Only an actually-deleted row (id not
 * found at all) means the helper should drop its refresh token and fall
 * back to a fresh device-authorization grant — see main()'s status-check in
 * chase-kiosk-helper.py.
 */
const NO_STORE = { 'Cache-Control': 'no-store' };

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
	if (rateLimited(getClientAddress())) {
		return new Response('Too many requests', { status: 429, headers: NO_STORE });
	}

	const deviceId = url.searchParams.get('deviceId');
	if (!deviceId || !isValidNanoid(deviceId)) {
		return new Response('Missing or invalid deviceId', { status: 400, headers: NO_STORE });
	}

	const device = await db.query.displayDevice.findFirst({
		where: { id: deviceId },
		columns: { id: true }
	});

	if (!device) {
		return new Response('Not found', { status: 404, headers: NO_STORE });
	}

	return new Response(null, { status: 204, headers: NO_STORE });
};
