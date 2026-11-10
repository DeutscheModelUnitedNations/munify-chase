import { describe, expect, it, vi } from 'vitest';
import { m } from '#lib/paraglide/messages';
import { beep, nsaPersonLabel, nsaScanMessage, presentInCommittee } from './nsaAttendance';

const user = (id: string, name?: string | null, actor?: string) => ({
	id,
	name,
	conferenceMember: actor ? { representation: { name: actor } } : null
});

describe('presentInCommittee', () => {
	it('counts only each person’s newest scan, checked in here, sorted by name', () => {
		const events = [
			{ id: '1', present: true, committeeId: 'c1', conferenceUser: user('u1', 'Zoe') },
			{ id: '2', present: false, committeeId: 'c1', conferenceUser: user('u2', 'Bob') },
			{ id: '3', present: true, committeeId: 'c1', conferenceUser: user('u2', 'Bob') },
			{ id: '4', present: true, committeeId: 'c1', conferenceUser: user('u3', null, 'Amnesty') },
			{ id: '5', present: true, committeeId: 'c2', conferenceUser: user('u4', 'Carl') },
			{ id: '6', present: true, committeeId: 'c1', conferenceUser: null },
			{ id: '7', present: true, committeeId: 'c1', conferenceUser: user('u5') }
		];
		expect(presentInCommittee(events, 'c1').map((e) => e.id)).toEqual(['7', '4', '1']);
	});
});

describe('nsaPersonLabel', () => {
	it('falls through name, actor, email and the fallback', () => {
		expect(nsaPersonLabel({ id: 'u', name: 'Ann' }, 'x')).toBe('Ann');
		expect(nsaPersonLabel(user('u', null, 'Amnesty'), 'x')).toBe('Amnesty');
		expect(nsaPersonLabel({ id: 'u', userEmail: 'a@b.c' }, 'x')).toBe('a@b.c');
		expect(nsaPersonLabel(null, 'x')).toBe('x');
	});
});

describe('nsaScanMessage', () => {
	const base = { name: 'Ann', committeeId: 'c1' };
	it('tells check-ins, check-outs here and from elsewhere apart', () => {
		expect(nsaScanMessage({ ...base, mode: 'IN', eventCommitteeId: 'c2' })).toBe(
			m.nsaCheckInSuccess({ name: 'Ann' })
		);
		expect(nsaScanMessage({ ...base, mode: 'OUT', eventCommitteeId: 'c1' })).toBe(
			m.nsaCheckOutSuccess({ name: 'Ann' })
		);
		expect(nsaScanMessage({ ...base, mode: 'OUT', eventCommitteeId: 'c2' })).toBe(
			m.nsaCheckOutFromOther({ name: 'Ann' })
		);
	});
});

describe('beep', () => {
	function fakeAudio() {
		const osc = {
			frequency: { value: 0 },
			connect: vi.fn(),
			start: vi.fn(),
			stop: vi.fn(),
			onended: null as null | (() => void)
		};
		const gain = { gain: { value: 0 }, connect: vi.fn() };
		osc.connect.mockReturnValue(gain);
		const close = vi.fn();
		class Ctx {
			currentTime = 1;
			destination = {};
			createOscillator = () => osc;
			createGain = () => gain;
			close = close;
		}
		return { Ctx: Ctx as unknown as typeof AudioContext, osc, close };
	}

	it('pings higher for ok and lower for errors, closing afterwards', () => {
		const { Ctx, osc, close } = fakeAudio();
		beep(true, { AudioContext: Ctx });
		expect(osc.frequency.value).toBe(880);
		expect(osc.stop).toHaveBeenCalledWith(1.12);
		osc.onended?.();
		expect(close).toHaveBeenCalled();
		beep(false, { webkitAudioContext: Ctx });
		expect(osc.frequency.value).toBe(220);
	});

	it('stays silent without audio or when it fails', () => {
		expect(() => beep(true, {})).not.toThrow();
		const Broken = function () {
			throw new Error('no audio');
		} as unknown as typeof AudioContext;
		expect(() => beep(true, { AudioContext: Broken })).not.toThrow();
		expect(() => beep(true)).not.toThrow();
	});
});
