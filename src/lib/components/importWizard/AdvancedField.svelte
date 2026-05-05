<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	interface Props {
		label: string;
		value: string;
		onChange: (v: string) => void;
		hint?: string;
		mono?: boolean;
	}

	let { label, value, onChange, hint, mono = true }: Props = $props();
	let open = $state(false);
</script>

{#if !open}
	<button
		type="button"
		class="btn btn-ghost btn-sm self-start opacity-70"
		onclick={() => (open = true)}
	>
		<i class="fa-solid fa-gear"></i>
		{m.editLabel({ label })}
	</button>
{:else}
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<span class="text-base-content/70 text-xs font-semibold">{label}</span>
			<button
				type="button"
				class="btn btn-ghost btn-xs"
				onclick={() => (open = false)}
				aria-label="Close"
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
		</div>
		<input
			type="text"
			class="input input-bordered {mono ? 'font-mono text-sm' : ''}"
			{value}
			oninput={(e) => onChange((e.target as HTMLInputElement).value)}
		/>
		{#if hint}
			<p class="text-base-content/55 m-0 text-xs">{hint}</p>
		{/if}
	</div>
{/if}
