<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	export type ScanLogEntry = {
		id: string;
		timestamp: Date;
		ok: boolean;
		mode: 'IN' | 'OUT';
		/** Display name when known (after a successful mutation), or the raw input. */
		label: string;
		message: string;
	};

	let { entries }: { entries: readonly ScanLogEntry[] } = $props();

	function icon(entry: ScanLogEntry) {
		if (!entry.ok) return 'ph-warning';
		return entry.mode === 'IN' ? 'ph-sign-in' : 'ph-sign-out';
	}
</script>

<ul class="flex max-h-56 flex-col gap-1 overflow-y-auto">
	{#each entries as entry (entry.id)}
		<li class="alert {entry.ok ? 'alert-success' : 'alert-error'} py-2" role="status">
			<i aria-hidden="true" class="ph-fill {icon(entry)}"></i>
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
