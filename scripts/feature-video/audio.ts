/**
 * Synthesizes the feature video soundtrack: a D major bed at 96 BPM (pad, bass, pluck
 * arpeggio, soft kick, shaker) plus in-key SFX on the scene cuts and clicks, all through
 * one shared reverb. Deterministic: the noise generator is seeded.
 *
 * Cue times (whooshes, clicks, bells) must follow the timeline in composition.html.
 */
import { writeFileSync } from 'node:fs';

export function synthesize(outPath: string) {

	const SR = 48000;
	const DUR = 49.5;
	const N = Math.floor(SR * DUR);
	const L = new Float32Array(N), R = new Float32Array(N);
	const sendL = new Float32Array(N), sendR = new Float32Array(N);

	const BEAT = 60 / 96, BAR = BEAT * 4;
	const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
	// D, Bm, G, A (MIDI roots in octave 3)
	const CH = { D: [50, 54, 57], Bm: [47, 50, 54], G: [43, 47, 50], A: [45, 49, 52] };
	const PROG = ['D', 'Bm', 'G', 'A'];
	const END = 46.25;
	const chordAt = (t) => (t >= END ? 'D' : t >= 45 ? 'A' : PROG[Math.floor(t / BAR) % 4]);

	let seed = 7;
	const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
	const smooth = (x) => x * x * (3 - 2 * x);
	const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

	function add(i, l, r, send = 0) {
		if (i < 0 || i >= N) return;
		L[i] += l; R[i] += r; sendL[i] += l * send; sendR[i] += r * send;
	}

	// ── Pad: soft additive saw, chord changes crossfade per bar
	{
		const ph = new Float64Array(64);
		let lpL = 0, lpR = 0;
		for (let i = 0; i < N; i++) {
			const t = i / SR;
			const swell = smooth(clamp(t / 2.2)) * (0.75 + 0.25 * smooth(clamp((t - 4.6) / 0.6)));
			const fadeOut = 1 - smooth(clamp((t - 47.6) / 1.9));
			const name = chordAt(t);
			const tb = t >= END ? t - END : t >= 45 ? t - 45 : t % BAR;
			const prevName = t >= END ? 'A' : t >= 45 ? PROG[Math.floor(45 / BAR) % 4] : PROG[(Math.floor(t / BAR) + 3) % 4];
			const xf = smooth(clamp(tb / 0.35));
			let sl = 0, sr = 0, k = 0;
			for (const [nm, w] of [[name, xf], [prevName, 1 - xf]]) {
				if (w < 0.001) { k += 8; continue; }
				const notes = [...CH[nm].map((n) => n + 12), CH[nm][0]];
				for (const n of notes) {
					for (const det of [-0.0016, 0.0016]) {
						const f = midi(n) * (1 + det);
						const idx = k++ % 64;
						ph[idx] += (2 * Math.PI * f) / SR;
						let v = 0;
						for (let h = 1; h <= 5; h++) v += Math.sin(ph[idx] * h) / (h * 1.4);
						if (det < 0) sl += v * w; else sr += v * w;
					}
				}
			}
			const lfo = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.11 * t);
			const a = 0.022 * swell * fadeOut * lfo;
			lpL += 0.12 * (sl * a - lpL); lpR += 0.12 * (sr * a - lpR);
			add(i, lpL, lpR, 0.5);
		}
	}

	// ── Note helper (pluck / bell / bass)
	function note(t0, f, { amp = 0.1, decay = 0.4, harm = [1, 0.3, 0.1], pan = 0, send = 0.3, attack = 0.004, len } = {}) {
		const i0 = Math.floor(t0 * SR), n = Math.floor((len ?? decay * 6) * SR);
		for (let j = 0; j < n; j++) {
			const t = j / SR;
			const env = Math.min(1, t / attack) * Math.exp(-t / decay);
			let v = 0;
			harm.forEach((h, k) => (v += h * Math.sin(2 * Math.PI * f * (k + 1) * t)));
			v *= env * amp;
			add(i0 + j, v * 0.7 * (pan <= 0 ? 1 : 1 - pan), v * 0.7 * (pan >= 0 ? 1 : 1 + pan), send);
		}
	}

	const GROOVE_FROM = 5.0, GROOVE_TO = 45.0;

	// ── Bass
	for (let t = GROOVE_FROM; t < GROOVE_TO; t += BEAT * 2) {
		const root = CH[chordAt(t + 0.01)][0] - 12;
		note(t, midi(root), { amp: 0.16, decay: 0.55, harm: [1, 0.25], send: 0.05, attack: 0.01 });
	}
	note(END, midi(38), { amp: 0.17, decay: 1.6, harm: [1, 0.2], send: 0.1, attack: 0.02, len: 3.2 });

	// ── Pluck arpeggio (8ths), sparse in the hook
	const ARP = [0, 1, 2, 1, 3, 2, 1, 2];
	let step = 0;
	for (let t = 1.25; t < GROOVE_TO; t += BEAT / 2, step++) {
		if (t < GROOVE_FROM && step % 2) continue;
		const c = CH[chordAt(t + 0.01)];
		const tones = [c[0] + 24, c[1] + 24, c[2] + 24, c[0] + 36];
		const accent = step % 4 === 0 ? 1 : 0.7;
		note(t, midi(tones[ARP[step % 8]]), { amp: 0.045 * accent, decay: 0.22, harm: [1, 0.35, 0.12, 0.05], pan: step % 2 ? 0.35 : -0.35, send: 0.35 });
	}

	// ── Soft kick on 1 and 3, shaker on offbeats
	for (let t = GROOVE_FROM; t < GROOVE_TO; t += BEAT * 2) {
		const i0 = Math.floor(t * SR);
		let ph = 0;
		for (let j = 0; j < SR * 0.35; j++) {
			const tt = j / SR;
			const f = 45 + 70 * Math.exp(-tt / 0.03);
			ph += (2 * Math.PI * f) / SR;
			const v = Math.sin(ph) * Math.min(1, tt / 0.003) * Math.exp(-tt / 0.12) * 0.2;
			add(i0 + j, v, v, 0);
		}
	}
	{
		let hp = 0, prev = 0;
		for (let t = GROOVE_FROM + BEAT / 2; t < GROOVE_TO; t += BEAT) {
			const i0 = Math.floor(t * SR);
			for (let j = 0; j < SR * 0.07; j++) {
				const n = rnd();
				hp = 0.6 * (hp + n - prev); prev = n;
				const v = hp * Math.exp(-(j / SR) / 0.018) * 0.018;
				add(i0 + j, v * 0.8, v, 0.2);
			}
		}
	}

	// ── Whooshes on scene changes (band-passed noise sweep)
	function whoosh(tc, amp = 0.09) {
		const d = 0.9, i0 = Math.floor((tc - d * 0.6) * SR);
		let a1 = 0, a2 = 0, b1 = 0, b2 = 0;
		for (let j = 0; j < d * SR; j++) {
			const x = j / (d * SR);
			const fc = 300 + 2200 * Math.pow(x, 1.5);
			const ka = 1 - Math.exp((-2 * Math.PI * fc) / SR), kb = 1 - Math.exp((-2 * Math.PI * fc * 0.3) / SR);
			const n = rnd();
			a1 += ka * (n - a1); a2 += ka * (a1 - a2);
			b1 += kb * (n - b1); b2 += kb * (b1 - b2);
			const env = Math.pow(Math.sin(Math.PI * x), 2);
			const v = (a2 - b2) * env * amp;
			add(i0 + j, v * (1 - x * 0.6), v * (0.4 + x * 0.6), 0.6);
		}
	}
	for (const t of [5.0, 13.5, 22.0, 31.0, 37.5, 43.0]) whoosh(t);

	// ── Clicks: muted in-key ticks (A5) with a tiny transient
	function click(t) {
		note(t, midi(81), { amp: 0.035, decay: 0.035, harm: [1, 0.2], send: 0.25 });
		note(t, midi(69), { amp: 0.03, decay: 0.05, harm: [1], send: 0.1 });
	}
	for (const t of [8.8, 18.25, 29.6, 33.6, 35.0, 39.45]) click(t);

	// ── Bells on "Free. Open source. Self-hostable." and the end card
	const bell = (t, n, amp = 0.05) => note(t, midi(n), { amp, decay: 0.9, harm: [1, 0, 0.25, 0, 0.08], send: 0.55, attack: 0.003 });
	bell(43.4, 74); bell(43.85, 78); bell(44.3, 81);
	for (const [k, n] of [74, 78, 81, 86].entries()) bell(END + k * 0.06, n, 0.04);

	// ── Reverb: Schroeder (4 combs + 2 allpasses) per channel
	function reverb(inp, offs) {
		const out = new Float32Array(N);
		const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: d + offs, buf: new Float32Array(d + offs), i: 0, f: 0 }));
		for (let i = 0; i < N; i++) {
			let s = 0;
			for (const c of combs) {
				const y = c.buf[c.i];
				c.f = y * 0.75 + c.f * 0.25;
				c.buf[c.i] = inp[i] + c.f * 0.82;
				c.i = (c.i + 1) % c.d;
				s += y;
			}
			out[i] = s * 0.25;
		}
		for (const d of [225 + offs, 556 + offs]) {
			const buf = new Float32Array(d); let k = 0;
			for (let i = 0; i < N; i++) {
				const b = buf[k]; const y = -out[i] + b; buf[k] = out[i] + b * 0.5; k = (k + 1) % d; out[i] = y;
			}
		}
		return out;
	}
	const rvL = reverb(sendL, 0), rvR = reverb(sendR, 23);

	const pcm = Buffer.alloc(N * 4);
	for (let i = 0; i < N; i++) {
		const l = Math.tanh((L[i] + rvL[i] * 0.35) * 1.2), r = Math.tanh((R[i] + rvR[i] * 0.35) * 1.2);
		pcm.writeInt16LE(Math.round(l * 32000), i * 4);
		pcm.writeInt16LE(Math.round(r * 32000), i * 4 + 2);
	}
	const h = Buffer.alloc(44);
	h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
	h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
	h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
	writeFileSync(outPath, Buffer.concat([h, pcm]));
}
