<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { scale } from 'svelte/transition';

	type Props = {
		connected: boolean;
		synced: boolean;
		forbidden: boolean;
		onRetry: () => void;
	};

	let { connected, synced, forbidden, onRetry }: Props = $props();

	const STUCK_MS = 10_000;

	// loading  → first wait
	// retrying → auto soft-retry fired, waiting again
	// failed   → give up, offer manual reload / retry
	let phase = $state<'loading' | 'retrying' | 'failed'>('loading');

	// Escalation timer. Re-arms whenever `phase` enters loading/retrying, so each
	// attempt gets its own fresh STUCK_MS window.
	$effect(() => {
		if (forbidden || synced || phase === 'failed') return;

		const timer = setTimeout(() => {
			if (phase === 'loading') {
				phase = 'retrying';
				onRetry();
			} else {
				phase = 'failed';
			}
		}, STUCK_MS);

		return () => clearTimeout(timer);
	});

	function manualRetry() {
		phase = 'retrying';
		onRetry();
	}

	function reload() {
		location.reload();
	}

	type StepState = 'pending' | 'active' | 'done';
	let connectState = $derived<StepState>(connected ? 'done' : 'active');
	let syncState = $derived<StepState>(synced ? 'done' : connected ? 'active' : 'pending');
</script>

{#snippet step(label: string, state: StepState)}
	<div class="flex items-center gap-2">
		<span
			class="flex h-6 w-6 items-center justify-center rounded-full text-xs
				{state === 'done'
				? 'bg-success text-success-content'
				: state === 'active'
					? 'bg-base-300 text-base-content'
					: 'bg-base-200 text-base-content/40'}"
		>
			{#if state === 'done'}
				<i class="fa-solid fa-check" in:scale={{ duration: 250, start: 0.3 }}></i>
			{:else if state === 'active'}
				<span class="loading loading-spinner loading-xs"></span>
			{:else}
				<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
			{/if}
		</span>
		<span
			class="text-sm {state === 'done'
				? 'text-base-content/70'
				: state === 'active'
					? 'font-medium text-base-content'
					: 'text-base-content/40'}"
		>
			{label}
		</span>
	</div>
{/snippet}

{#if forbidden}
	<div class="alert alert-warning my-4">
		<i class="fa-solid fa-triangle-exclamation"></i>
		<span>{m.collabSessionExpired()}</span>
		<button class="btn btn-sm" onclick={reload}>
			{m.reload()}
		</button>
	</div>
{:else}
	<div class="mx-auto w-full max-w-3xl py-6">
		<!-- Step indicators -->
		<div class="mb-6 flex items-center justify-center gap-4">
			{@render step(m.syncStepConnect(), connectState)}
			<span
				class="h-px w-8 transition-colors duration-300 {connected ? 'bg-success' : 'bg-base-300'}"
			></span>
			{@render step(m.syncStepSynchronize(), syncState)}
		</div>

		<!-- Status / recovery banners -->
		{#if phase === 'retrying'}
			<div class="alert alert-info mb-6 text-sm" in:scale={{ duration: 200, start: 0.95 }}>
				<span class="loading loading-spinner loading-sm"></span>
				<span>{m.syncTakingLonger()}</span>
			</div>
		{:else if phase === 'failed'}
			<div class="alert alert-warning mb-6" in:scale={{ duration: 200, start: 0.95 }}>
				<i class="fa-solid fa-triangle-exclamation"></i>
				<div class="flex-1">
					<div class="font-semibold">{m.syncFailedTitle()}</div>
				</div>
				<button class="btn btn-sm btn-ghost" onclick={manualRetry}>
					<i class="fa-solid fa-rotate-right"></i>
					{m.tryAgain()}
				</button>
				<button class="btn btn-sm btn-primary" onclick={reload}>
					{m.reload()}
				</button>
			</div>
		{/if}

		<!-- Document-shaped skeleton -->
		<div
			class="space-y-6 rounded-lg border border-base-300 bg-base-100 p-8
				{phase === 'failed' ? 'opacity-40' : ''}"
			aria-hidden="true"
		>
			<!-- Header -->
			<div class="space-y-3 border-b border-base-200 pb-6">
				<div class="flex gap-4">
					<div class="skeleton h-5 w-32"></div>
					<div class="skeleton h-5 w-24"></div>
				</div>
				<div class="skeleton h-7 w-3/4"></div>
				<div class="skeleton h-4 w-1/2"></div>
			</div>

			<!-- Preamble -->
			<div class="space-y-3">
				{#each [90, 75, 85, 60] as w (w)}
					<div class="flex items-start gap-3">
						<div class="skeleton mt-1 h-3 w-3 shrink-0 rounded-full"></div>
						<div class="skeleton h-4" style="width: {w}%"></div>
					</div>
				{/each}
			</div>

			<!-- Operative clauses -->
			<div class="space-y-5">
				{#each [1, 2, 3, 4] as n (n)}
					<div class="flex items-start gap-3">
						<div class="skeleton h-6 w-6 shrink-0 rounded"></div>
						<div class="flex-1 space-y-2">
							<div class="skeleton h-4 w-full"></div>
							<div class="skeleton h-4" style="width: {n % 2 === 0 ? 65 : 80}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
