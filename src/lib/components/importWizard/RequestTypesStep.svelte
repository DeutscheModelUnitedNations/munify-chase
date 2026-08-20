<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import { nanoid } from '$lib/helpers/nanoid';
	import { getDefaultRequestTypes } from '$lib/data/defaultRequestTypes';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
	}

	let { data = $bindable() }: Props = $props();

	function loadDefaults() {
		if (!data.requestTypes) data.requestTypes = [];
		const existingNames = new Set(data.requestTypes.map((rt) => rt.name));
		for (const rt of getDefaultRequestTypes()) {
			if (existingNames.has(rt.name)) continue;
			data.requestTypes.push({ id: nanoid(), name: rt.name, faIcon: rt.faIcon, enabled: true });
		}
	}

	function addRequestType() {
		if (!data.requestTypes) data.requestTypes = [];
		data.requestTypes.push({ id: nanoid(), name: '', faIcon: 'fa-flag', enabled: true });
	}

	function removeRequestType(id: string | undefined) {
		data.requestTypes = (data.requestTypes ?? []).filter((rt) => rt.id !== id);
	}

	function moveRequestType(index: number, direction: -1 | 1) {
		const list = data.requestTypes;
		if (!list) return;
		const target = index + direction;
		if (target < 0 || target >= list.length) return;
		[list[index], list[target]] = [list[target], list[index]];
		data.requestTypes = list;
	}
</script>

<div class="flex flex-col gap-7">
	<StepHeader
		eyebrow={m.requestTypesEyebrow()}
		title={m.requestTypes()}
		subtitle={m.requestTypesSubtitle()}
	/>

	<fieldset class="fieldset bg-base-100 rounded-box border p-5">
		<legend class="fieldset-legend">{m.requestTypes()}</legend>

		{#if (data.requestTypes ?? []).length === 0}
			<p class="text-base-content/55 m-0 text-sm">{m.requestTypesEmptyHint()}</p>
		{/if}

		{#each data.requestTypes ?? [] as rt, i (rt.id ?? i)}
			<div class="join w-full">
				<div class="join-item flex flex-col">
					<button
						type="button"
						class="btn btn-xs join-item h-1/2"
						aria-label="Move up"
						disabled={i === 0}
						onclick={() => moveRequestType(i, -1)}
					>
						<i class="fa-solid fa-chevron-up"></i>
					</button>
					<button
						type="button"
						class="btn btn-xs join-item h-1/2"
						aria-label="Move down"
						disabled={i === (data.requestTypes?.length ?? 0) - 1}
						onclick={() => moveRequestType(i, 1)}
					>
						<i class="fa-solid fa-chevron-down"></i>
					</button>
				</div>
				<div class="btn join-item bg-primary text-primary-content w-14 pointer-events-none">
					<i class="fa-solid fa-{(rt.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
				</div>
				<input
					type="text"
					class="input input-bordered join-item w-32 font-mono text-sm"
					bind:value={rt.faIcon}
					placeholder={m.icon()}
				/>
				<input
					type="text"
					class="input input-bordered join-item flex-1"
					bind:value={rt.name}
					placeholder={m.requestTypeNamePlaceholder()}
				/>
				<label class="btn join-item gap-2">
					<input type="checkbox" class="toggle toggle-sm" bind:checked={rt.enabled} />
					{m.enabled()}
				</label>
				<button
					type="button"
					class="btn join-item text-error"
					aria-label="Remove request type"
					onclick={() => removeRequestType(rt.id)}
				>
					<i class="fa-solid fa-trash"></i>
				</button>
			</div>
		{/each}

		<div class="mt-2 flex gap-2">
			<button type="button" class="btn btn-sm" onclick={loadDefaults}>
				<i class="fa-solid fa-wand-magic-sparkles"></i>
				{m.loadDefaultRequestTypes()}
			</button>
			<button type="button" class="btn btn-sm btn-ghost" onclick={addRequestType}>
				<i class="fa-solid fa-plus"></i>
				{m.addRequestType()}
			</button>
		</div>
	</fieldset>
</div>
