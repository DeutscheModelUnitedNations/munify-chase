<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import AdvancedField from './AdvancedField.svelte';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
	}

	let { data = $bindable() }: Props = $props();

	const upcoming = [
		{ icon: 'building-columns', label: () => m.committees() },
		{ icon: 'flag', label: () => m.delegations() },
		{ icon: 'circle-check', label: () => m.editStep() }
	];
</script>

<div class="flex flex-col gap-7">
	<StepHeader eyebrow={m.basicsEyebrow()} title={m.basicsTitle()} subtitle={m.basicsSubtitle()} />

	<div class="card bg-base-100 shadow">
		<div class="card-body gap-5">
			<label class="flex flex-col gap-1.5">
				<span class="text-base-content/70 text-xs font-semibold">{m.conferenceTitle()}</span>
				<input
					type="text"
					class="input input-bordered input-xl w-full"
					bind:value={data.title}
					placeholder={m.conferenceTitlePlaceholder()}
				/>
			</label>

			<AdvancedField
				label={m.conferenceId()}
				value={data.id}
				onChange={(v) => (data.id = v)}
				hint={m.conferenceIdHint()}
			/>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		{#each upcoming as s (s.icon)}
			<div
				class="bg-primary/5 border-primary/20 text-base-content/70 flex items-center gap-3 rounded-box border p-3 text-sm"
			>
				<span class="text-primary text-lg"><i class="fa-solid fa-{s.icon}"></i></span>
				<span>{m.nextUpLabel({ label: s.label() })}</span>
			</div>
		{/each}
	</div>
</div>
