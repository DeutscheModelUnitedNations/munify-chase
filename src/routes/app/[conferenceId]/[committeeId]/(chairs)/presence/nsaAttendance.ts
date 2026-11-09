import { m } from '#lib/paraglide/messages';

type NsaUser =
	| {
			id: string;
			name?: string | null;
			userEmail?: string | null;
			conferenceMember?: { representation?: { name?: string | null } | null } | null;
	  }
	| null
	| undefined;

interface NsaEvent {
	present: boolean;
	committeeId: string;
	conferenceUser?: NsaUser;
}

/** The name an NSA sorts under: their own, else the actor's */
function sortName(user: NsaUser) {
	return user?.name ?? user?.conferenceMember?.representation?.name ?? '';
}

/**
 * The NSAs in this committee right now, by name: each person's newest scan (the events come
 * newest first) counts, and only check-ins here.
 */
export function presentInCommittee<E extends NsaEvent>(events: E[], committeeId: string): E[] {
	const seen = new Set<string>();
	const out: E[] = [];
	for (const e of events) {
		const uid = e.conferenceUser?.id;
		if (!uid || seen.has(uid)) continue;
		seen.add(uid);
		if (e.present && e.committeeId === committeeId) out.push(e);
	}
	return out.sort((a, b) => sortName(a.conferenceUser).localeCompare(sortName(b.conferenceUser)));
}

/** Who a scan was for: their name, the actor's, their email, else what the chair picked */
export function nsaPersonLabel(user: NsaUser, fallback: string): string {
	return user?.name ?? user?.conferenceMember?.representation?.name ?? user?.userEmail ?? fallback;
}

/** The scan log's message for a check-in or check-out that went through */
export function nsaScanMessage({
	mode,
	name,
	eventCommitteeId,
	committeeId
}: {
	mode: 'IN' | 'OUT';
	name: string;
	/** The committee the person was checked out from */
	eventCommitteeId: string;
	committeeId: string;
}): string {
	if (mode === 'IN') return m.nsaCheckInSuccess({ name });
	if (eventCommitteeId !== committeeId) return m.nsaCheckOutFromOther({ name });
	return m.nsaCheckOutSuccess({ name });
}

type AudioWindow = {
	AudioContext?: typeof AudioContext;
	webkitAudioContext?: typeof AudioContext;
};

/**
 * A tiny sine ping: ok is higher, an error lower. Skipped where there is no AudioContext (older
 * Safari etc.), the visual feedback is the source of truth.
 */
export function beep(ok: boolean, win?: AudioWindow) {
	try {
		const w = win ?? (window as AudioWindow);
		const Ctx = w.AudioContext ?? w.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.value = ok ? 880 : 220;
		gain.gain.value = 0.05;
		osc.connect(gain).connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + 0.12);
		osc.onended = () => ctx.close();
	} catch {
		/* ignore */
	}
}
