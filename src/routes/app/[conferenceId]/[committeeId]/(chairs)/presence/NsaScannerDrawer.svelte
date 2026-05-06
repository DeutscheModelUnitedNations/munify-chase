<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import QrScanner from '$lib/components/QrScanner.svelte';

	interface Props {
		open: boolean;
		committeeId: string;
	}

	let { open = $bindable(), committeeId }: Props = $props();

	type Mode = 'IN' | 'OUT';
	let mode = $state<Mode>('IN');
	let manualCode = $state('');

	type LogEntry = {
		id: string;
		timestamp: Date;
		ok: boolean;
		mode: Mode;
		// Display name when known (after a successful mutation), or the raw input.
		label: string;
		message: string;
	};
	let scanLog = $state<LogEntry[]>([]);

	// Holds the most recent scan per code so we can render a green flash etc.
	// Not strictly needed for correctness — the QrScanner debounces rapid repeats.
	let busy = $state(false);

	const modeTabs = [
		{ id: 'IN' as const, label: m.checkIn(), faIcon: 'fa-arrow-right-to-bracket' },
		{ id: 'OUT' as const, label: m.checkOut(), faIcon: 'fa-arrow-right-from-bracket' }
	];

	function beep(ok: boolean) {
		// Tiny sine ping; ok = higher pitch, error = lower. Skipped if AudioContext
		// is unavailable (older Safari etc.) — visual feedback is the source of truth.
		try {
			const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
			if (!Ctx) return;
			const ctx: AudioContext = new Ctx();
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

	function pushLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
		const id = crypto.randomUUID();
		scanLog = [{ id, timestamp: new Date(), ...entry }, ...scanLog].slice(0, 10);
	}

	async function handleScan(rawText: string) {
		const text = rawText.trim();
		if (!text) return;
		// Heuristic: short codes (≤8 chars, alphanumeric) are treated as the manual
		// fallback `attendanceCode`; longer values as the full conferenceUser.id (nanoid 30).
		const isShortCode = text.length <= 8;
		await runMutation(isShortCode ? { attendanceCode: text } : { conferenceUserId: text }, text);
	}

	async function handleManualSubmit(e: Event) {
		e.preventDefault();
		const code = manualCode.trim();
		if (!code) return;
		manualCode = '';
		await runMutation({ attendanceCode: code }, code);
	}

	async function runMutation(
		ident: { conferenceUserId?: string; attendanceCode?: string },
		fallbackLabel: string
	) {
		if (busy) return;
		busy = true;

		const args = { committeeId, ...ident };
		try {
			const event =
				mode === 'IN'
					? await client.mutate.recordNsaCheckIn({
							__args: args,
							id: true,
							type: true,
							committeeId: true,
							timestamp: true,
							note: true,
							conferenceUser: {
								id: true,
								userEmail: true,
								conferenceMember: {
									representation: { name: true, faIcon: true }
								}
							}
						})
					: await client.mutate.recordNsaCheckOut({
							__args: args,
							id: true,
							type: true,
							committeeId: true,
							timestamp: true,
							conferenceUser: {
								id: true,
								userEmail: true,
								conferenceMember: {
									representation: { name: true, faIcon: true }
								}
							}
						});

			const personLabel =
				event.conferenceUser?.conferenceMember?.representation?.name ??
				event.conferenceUser?.userEmail ??
				fallbackLabel;

			let message: string;
			if (mode === 'IN') {
				message = m.nsaCheckInSuccess({ name: personLabel });
			} else if (event.committeeId !== committeeId) {
				message = m.nsaCheckOutFromOther({ name: personLabel });
			} else {
				message = m.nsaCheckOutSuccess({ name: personLabel });
			}

			pushLog({ ok: true, mode, label: personLabel, message });
			beep(true);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			pushLog({ ok: false, mode, label: fallbackLabel, message: msg });
			beep(false);
		} finally {
			busy = false;
		}
	}

	function close() {
		open = false;
		scanLog = [];
		manualCode = '';
	}
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">{m.nsaAttendanceScannerTitle()}</h2>
			<button class="btn btn-ghost btn-sm" onclick={close} aria-label={m.close()}>
				<i class="fas fa-xmark text-xl"></i>
			</button>
		</header>

		<Tabs activeTab={mode} tabs={modeTabs} onTabChange={(tab) => (mode = tab)} />

		<div class="grid gap-4 md:grid-cols-2">
			<div>
				{#if open}
					<QrScanner onDetect={handleScan} paused={busy} />
				{/if}
				<p class="text-base-content/60 mt-2 text-xs">
					{m.qrScannerHint()}
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<form class="form-control" onsubmit={handleManualSubmit}>
					<label class="label" for="nsa-manual-code">
						<span class="label-text">{m.manualCodeFallback()}</span>
					</label>
					<div class="join">
						<input
							id="nsa-manual-code"
							class="input join-item input-lg w-full font-mono uppercase"
							placeholder="••••••"
							maxlength="6"
							bind:value={manualCode}
							autocomplete="off"
						/>
						<button
							class="btn join-item btn-primary btn-lg"
							type="submit"
							disabled={busy || manualCode.trim().length === 0}
						>
							{mode === 'IN' ? m.checkIn() : m.checkOut()}
						</button>
					</div>
				</form>

				<div class="divider text-base-content/50 my-1 text-xs">{m.recentScans()}</div>

				<ul class="flex max-h-56 flex-col gap-1 overflow-y-auto">
					{#each scanLog as entry (entry.id)}
						<li class="alert {entry.ok ? 'alert-success' : 'alert-error'} py-2" role="status">
							<i
								class="fas {entry.ok
									? entry.mode === 'IN'
										? 'fa-arrow-right-to-bracket'
										: 'fa-arrow-right-from-bracket'
									: 'fa-triangle-exclamation'}"
							></i>
							<div class="flex-1 text-sm">
								<div class="font-medium">{entry.label}</div>
								<div class="text-xs opacity-80">{entry.message}</div>
							</div>
							<time class="text-xs opacity-60">
								{entry.timestamp.toLocaleTimeString()}
							</time>
						</li>
					{:else}
						<li class="text-base-content/50 py-4 text-center text-sm">{m.noScansYet()}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</Modal>
