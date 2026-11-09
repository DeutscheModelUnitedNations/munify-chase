<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import Modal from '#lib/components/Modal.svelte';
	import Tabs from '#lib/components/Tabs.svelte';
	import QrScanner from '#lib/components/QrScanner.svelte';
	import { loadIdentityKeys } from '#lib/api/identityKeys';
	import { identifyNsa, type NsaScanFailure } from '#lib/helpers/nsaScan';
	import { nsaOfUser, searchNsas } from '#lib/helpers/nsaSearch';
	import NsaScanLog, { type ScanLogEntry } from './NsaScanLog.svelte';

	interface Props {
		open: boolean;
		conferenceId: string;
		committeeId: string;
	}

	let { open = $bindable(), conferenceId, committeeId }: Props = $props();

	type Mode = 'IN' | 'OUT';
	let mode = $state<Mode>('IN');
	let search = $state('');

	// The conference's NSAs: a scanned code is checked and matched here, offline if need be, and
	// the name search looks through them.
	const nsaUsers = $derived(
		await client.liveQuery.conferenceUsers({
			__args: {
				where: { conferenceId: { eq: conferenceId }, conferenceUserType: 'NON_STATE_ACTOR' }
			},
			id: true,
			name: true,
			userEmail: true,
			user: { id: true },
			cardNumber: true,
			conferenceMember: { representation: { name: true } }
		})
	);
	const nsas = $derived(Array.from(nsaUsers ?? []).map(nsaOfUser));
	const searchResults = $derived(searchNsas({ nsas, query: search }));

	const scanFailures: Record<NsaScanFailure, () => string> = {
		unsigned: m.nsaScanUnsigned,
		wrongKind: m.nsaScanWrongKind,
		forged: m.nsaScanForged,
		expired: m.nsaScanExpired,
		otherConference: m.nsaScanOtherConference,
		outdatedCard: m.nsaScanOutdatedCard,
		notNsa: m.nsaScanNotNsa,
		noKey: m.nsaScanNoKey
	};

	let scanLog = $state<ScanLogEntry[]>([]);

	// Holds the most recent scan per code so we can render a green flash etc.
	// Not strictly needed for correctness — the QrScanner debounces rapid repeats.
	let busy = $state(false);

	const modeTabs = [
		{ id: 'IN' as const, label: m.checkIn(), icon: 'sign-in' },
		{ id: 'OUT' as const, label: m.checkOut(), icon: 'sign-out' }
	];

	function beep(ok: boolean) {
		// Tiny sine ping; ok = higher pitch, error = lower. Skipped if AudioContext
		// is unavailable (older Safari etc.) — visual feedback is the source of truth.
		try {
			const Ctx =
				window.AudioContext ??
				(window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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

	function pushLog(entry: Omit<ScanLogEntry, 'id' | 'timestamp'>) {
		const id = crypto.randomUUID();
		scanLog = [{ id, timestamp: new Date(), ...entry }, ...scanLog].slice(0, 10);
	}

	type Nsa = (typeof nsas)[number];
	const labelOf = (nsa: Nsa) => nsa.name ?? nsa.userEmail;

	/** Who a code names, checked offline against the loaded NSAs; a message when it names nobody. */
	async function identify(code: string): Promise<{ nsa: Nsa } | { message: string }> {
		const keys = await loadIdentityKeys().catch(() => null);
		if (!keys) return { message: m.nsaScanNoKey() };
		const scan = await identifyNsa({ code, keys, conferenceId, nsas });
		return scan.found ? { nsa: scan.nsa } : { message: scanFailures[scan.reason]() };
	}

	function failed(message: string) {
		pushLog({ ok: false, mode, label: m.nsaAttendanceScannerTitle(), message });
		beep(false);
	}

	async function handleScan(rawText: string) {
		const code = rawText.trim();
		if (!code || busy) return;
		const result = await identify(code);
		if ('message' in result) return failed(result.message);
		await runMutation({ conferenceUserId: result.nsa.id, code, label: labelOf(result.nsa) });
	}

	async function pick(nsa: Nsa) {
		search = '';
		await runMutation({ conferenceUserId: nsa.id, label: labelOf(nsa) });
	}

	const modeLabel = $derived(mode === 'IN' ? m.checkIn() : m.checkOut());

	/** Checks the NSA in or out; a scanned code goes along for the server to check again. */
	async function runMutation({
		conferenceUserId,
		code,
		label
	}: {
		conferenceUserId: string;
		code?: string;
		label: string;
	}) {
		if (busy) return;
		busy = true;

		const args = { committeeId, conferenceUserId, code };
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
								name: true,
								conferenceMember: {
									representation: { name: true, icon: true }
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
								name: true,
								conferenceMember: {
									representation: { name: true, icon: true }
								}
							}
						});

			const personLabel =
				event.conferenceUser?.name ??
				event.conferenceUser?.conferenceMember?.representation?.name ??
				event.conferenceUser?.userEmail ??
				label;

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
			pushLog({ ok: false, mode, label, message: msg });
			beep(false);
		} finally {
			busy = false;
		}
	}

	function close() {
		open = false;
		scanLog = [];
		search = '';
	}
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header class="flex items-center justify-between">
			<h2 class="text-2xl font-bold">{m.nsaAttendanceScannerTitle()}</h2>
			<button class="btn btn-ghost btn-sm" onclick={close} aria-label={m.close()}>
				<i aria-hidden="true" class="ph-fill ph-x text-xl"></i>
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
				<div class="form-control">
					<label class="label" for="nsa-name-search">
						<span class="label-text">{m.nsaSearchByName()}</span>
					</label>
					<input
						id="nsa-name-search"
						class="input input-lg w-full"
						placeholder={m.nsaSearchPlaceholder()}
						bind:value={search}
						autocomplete="off"
					/>
					{#if search.trim()}
						<ul class="menu bg-base-200 rounded-box mt-2 w-full">
							{#each searchResults as nsa (nsa.id)}
								<li>
									<button disabled={busy} onclick={() => pick(nsa)}>
										<div class="flex flex-1 flex-col items-start">
											<span class="font-medium">{labelOf(nsa)}</span>
											{#if nsa.nsaName}
												<span class="text-xs opacity-70">{nsa.nsaName}</span>
											{/if}
										</div>
										<span class="badge badge-primary">{modeLabel}</span>
									</button>
								</li>
							{:else}
								<li class="text-base-content/60 p-2 text-sm">{m.nsaSearchNoResults()}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="divider text-base-content/50 my-1 text-xs">{m.recentScans()}</div>

				<NsaScanLog entries={scanLog} />
			</div>
		</div>
	</div>
</Modal>
