import { error } from '@sveltejs/kit';
import { db } from '$api/db/db';
import { isValidNanoid } from '$lib/helpers/nanoid';
import type { RequestHandler } from './$types';

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
export const GET: RequestHandler = async ({ url }) => {
	const deviceId = url.searchParams.get('deviceId');
	if (!deviceId || !isValidNanoid(deviceId)) {
		throw error(400, 'Missing or invalid deviceId');
	}

	const device = await db.query.displayDevice.findFirst({
		where: { id: deviceId },
		columns: { id: true }
	});

	if (!device) {
		throw error(404, 'Not found');
	}

	return new Response(null, { status: 204 });
};
