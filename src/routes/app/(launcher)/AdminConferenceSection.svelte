<script lang="ts">
	import AdminConferenceRow from '#lib/components/launcher/AdminConferenceRow.svelte';
	import type { LauncherConference } from '#lib/components/launcher/types';

	interface Props {
		label: string;
		conferences: LauncherConference[];
		/** Past conferences are shown a little muted */
		muted: boolean;
		onDelete: (target: { id: string; title: string }) => void;
	}

	let { label, conferences, muted, onDelete }: Props = $props();
</script>

<section class:opacity-85={muted}>
	<div
		class="text-base-content/55 mb-3 flex items-baseline gap-2 text-xs font-bold uppercase tracking-widest"
	>
		<span>{label}</span>
		<span
			class="bg-base-content/10 text-base-content/70 rounded-full px-2 py-0.5 text-xs font-semibold tracking-normal"
		>
			{conferences.length}
		</span>
	</div>
	<div class="card bg-base-200 p-0">
		{#each conferences as c, i (c.id)}
			<div class:is-first={i === 0} class:is-last={i === conferences.length - 1}>
				<AdminConferenceRow conference={c} {onDelete} />
			</div>
		{/each}
	</div>
</section>

<style>
	/* Round only the first/last row of each grouped admin section so the ellipsis
	   dropdown can escape (no overflow:hidden on the container). */
	.is-first :global(> div) {
		border-top-left-radius: var(--radius-box);
		border-top-right-radius: var(--radius-box);
	}
	.is-last :global(> div) {
		border-bottom-left-radius: var(--radius-box);
		border-bottom-right-radius: var(--radius-box);
		border-bottom: none;
	}
</style>
