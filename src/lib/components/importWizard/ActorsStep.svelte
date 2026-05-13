<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import { nanoid } from '$lib/helpers/nanoid';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
	}

	let { data = $bindable() }: Props = $props();

	const nsas = $derived(data.representations.filter((r) => r.representationType === 'NSA'));
	const unActors = $derived(data.representations.filter((r) => r.representationType === 'UN'));

	function memberCount(repId: string) {
		return (data.conferenceMembers ?? []).filter((cm) => cm.representationId === repId).length;
	}

	function addRepresentation(type: 'NSA' | 'UN') {
		const repId = nanoid();
		data.representations.push({
			id: repId,
			representationType: type,
			faIcon: type === 'NSA' ? 'megaphone' : undefined,
			name: ''
		});
		if (!data.conferenceMembers) data.conferenceMembers = [];
		data.conferenceMembers.push({ id: nanoid(), representationId: repId });
	}

	function removeRepresentation(id: string) {
		data.representations = data.representations.filter((r) => r.id !== id);
		data.conferenceMembers = (data.conferenceMembers ?? []).filter(
			(cm) => cm.representationId !== id
		);
		data.committeeMembers = (data.committeeMembers ?? []).filter(
			(cm) => cm.representationId !== id
		);
	}
</script>

<div class="flex flex-col gap-7">
	<StepHeader eyebrow={m.actorsEyebrow()} title={m.actorsTitle()} subtitle={m.actorsSubtitle()} />

	<fieldset class="fieldset bg-base-100 rounded-box border p-5">
		<legend class="fieldset-legend">{m.nonStateActors()}</legend>
		{#if nsas.length === 0}
			<p class="text-base-content/55 m-0 text-sm">{m.nsaExamplesHint()}</p>
		{/if}
		{#each nsas as rep (rep.id)}
			<div class="join w-full">
				<div class="btn join-item bg-error text-error-content w-14 pointer-events-none">
					<i class="fa-solid fa-{(rep.faIcon ?? 'megaphone').replace('fa-', '')}"></i>
				</div>
				<input
					type="text"
					class="input input-bordered join-item w-44 font-mono text-sm"
					bind:value={rep.faIcon}
					placeholder={m.icon()}
				/>
				<input
					type="text"
					class="input input-bordered join-item flex-1"
					bind:value={rep.name}
					placeholder={m.nonStateActor()}
				/>
				<div class="btn join-item {memberCount(rep.id) === 0 ? 'btn-error' : ''}">
					<i class="fa-solid fa-users"></i>
					<span class="ml-2">{memberCount(rep.id)}</span>
				</div>
				<button
					type="button"
					class="btn join-item text-error"
					aria-label="Remove NSA"
					onclick={() => removeRepresentation(rep.id)}
				>
					<i class="fa-solid fa-trash"></i>
				</button>
			</div>
		{/each}
		<button class="btn btn-sm self-start" onclick={() => addRepresentation('NSA')}>
			<i class="fa-solid fa-plus"></i>
			{m.addNonStateActor()}
		</button>
	</fieldset>

	<fieldset class="fieldset bg-base-100 rounded-box border p-5">
		<legend class="fieldset-legend">{m.unActors()}</legend>
		{#if unActors.length === 0}
			<p class="text-base-content/55 m-0 text-sm">{m.unActorExamplesHint()}</p>
		{/if}
		{#each unActors as rep (rep.id)}
			<div class="join w-full">
				<div
					class="btn join-item w-14 pointer-events-none"
					style="background:#5b92e5; color:white;"
				>
					<span class="text-xs font-bold tracking-widest">UN</span>
				</div>
				<input
					type="text"
					class="input input-bordered join-item flex-1"
					bind:value={rep.name}
					placeholder={m.unActor()}
				/>
				<div class="btn join-item {memberCount(rep.id) === 0 ? 'btn-error' : ''}">
					<i class="fa-solid fa-users"></i>
					<span class="ml-2">{memberCount(rep.id)}</span>
				</div>
				<button
					type="button"
					class="btn join-item text-error"
					aria-label="Remove UN actor"
					onclick={() => removeRepresentation(rep.id)}
				>
					<i class="fa-solid fa-trash"></i>
				</button>
			</div>
		{/each}
		<button class="btn btn-sm self-start" onclick={() => addRepresentation('UN')}>
			<i class="fa-solid fa-plus"></i>
			{m.addUnActor()}
		</button>
	</fieldset>
</div>
