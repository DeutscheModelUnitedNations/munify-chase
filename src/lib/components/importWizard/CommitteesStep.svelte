<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import { nanoid } from '$lib/helpers/nanoid';
	import AdvancedField from './AdvancedField.svelte';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
	}

	let { data = $bindable() }: Props = $props();

	function addCommittee() {
		data.committees.push({
			id: nanoid(),
			name: '',
			abbreviation: ''
		});
	}

	function removeCommittee(id: string) {
		data.committees = data.committees.filter((c) => c.id !== id);
		data.agendaItems = data.agendaItems.filter((a) => a.committeeId !== id);
		data.committeeMembers = data.committeeMembers?.filter((cm) => cm.committeeId !== id);
	}

	function addAgenda(committeeId: string) {
		data.agendaItems.push({ id: nanoid(), committeeId, title: '' });
	}

	function removeAgenda(committeeId: string, idx: number) {
		const itemsForCommittee = data.agendaItems
			.map((item, originalIdx) => ({ item, originalIdx }))
			.filter(({ item }) => item.committeeId === committeeId);
		const target = itemsForCommittee[idx];
		if (!target) return;
		data.agendaItems = data.agendaItems.filter((_, i) => i !== target.originalIdx);
	}
</script>

<div class="flex flex-col gap-6">
	<StepHeader
		eyebrow={m.committeesEyebrow()}
		title={m.committeesTitle()}
		subtitle={m.committeesSubtitle()}
	/>

	{#if data.committees.length === 0}
		<div
			class="card bg-base-100/60 border-base-content/20 items-center border-2 border-dashed p-10 text-center"
		>
			<div class="text-primary mb-3 text-5xl">
				<i class="fa-solid fa-building-columns"></i>
			</div>
			<h3 class="mb-2 text-xl font-bold">{m.noCommitteesYetTitle()}</h3>
			<p class="text-base-content/65 mx-auto mb-5 max-w-prose">{m.noCommitteesYetBody()}</p>
			<button class="btn btn-primary btn-lg" onclick={addCommittee}>
				<i class="fa-solid fa-plus"></i>
				{m.addFirstCommittee()}
			</button>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			{#each data.committees as committee (committee.id)}
				{@const agendaItemsForCommittee = data.agendaItems.filter(
					(a) => a.committeeId === committee.id
				)}
				<div class="card bg-base-100 border-base-content/10 relative gap-4 border p-6 shadow-sm">
					<div class="flex items-start gap-3">
						<div
							class="bg-primary/15 text-primary grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl font-mono text-lg font-bold"
						>
							{committee.abbreviation || '–'}
						</div>
						<div class="grid flex-1 grid-cols-1 gap-3 md:grid-cols-[180px_1fr]">
							<input
								type="text"
								class="input input-bordered font-mono font-semibold"
								placeholder={m.committeeAbbreviationPlaceholder()}
								bind:value={committee.abbreviation}
							/>
							<input
								type="text"
								class="input input-bordered input-lg"
								placeholder={m.committeeNamePlaceholder()}
								bind:value={committee.name}
							/>
						</div>
						<button
							type="button"
							class="btn btn-ghost btn-sm text-error"
							aria-label="Remove committee"
							onclick={() => removeCommittee(committee.id)}
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</div>

					<input
						type="text"
						class="input input-bordered w-full italic"
						placeholder={m.resolutionHeadlinePlaceholder()}
						bind:value={committee.resolutionHeadline}
						style="font-family: 'Vollkorn', serif;"
					/>

					<fieldset class="fieldset bg-base-200 rounded-box p-4">
						<legend class="fieldset-legend">{m.agendaTitle()}</legend>
						{#if agendaItemsForCommittee.length === 0}
							<p class="text-base-content/55 m-0 text-sm">{m.noAgendaItems()}</p>
						{/if}
						{#each agendaItemsForCommittee as item, i (i)}
							<div class="flex items-center gap-2">
								<div
									class="bg-base-100 text-primary grid h-7 w-7 flex-shrink-0 place-items-center rounded-md font-mono text-xs font-bold"
								>
									{i + 1}
								</div>
								<input
									type="text"
									class="input input-bordered flex-1"
									placeholder={m.agendaItemTitlePlaceholder()}
									bind:value={item.title}
								/>
								<button
									type="button"
									class="btn btn-ghost btn-sm text-error"
									aria-label="Remove agenda item"
									onclick={() => removeAgenda(committee.id, i)}
								>
									<i class="fa-solid fa-trash"></i>
								</button>
							</div>
						{/each}
						<button
							type="button"
							class="btn btn-sm self-start"
							onclick={() => addAgenda(committee.id)}
						>
							<i class="fa-solid fa-plus"></i>
							{m.addAgendaItem()}
						</button>
					</fieldset>

					<AdvancedField
						label={m.committeeId()}
						value={committee.id}
						onChange={(v) => (committee.id = v)}
						hint={m.committeeIdHint()}
					/>
				</div>
			{/each}

			<button class="btn btn-outline btn-primary self-start" onclick={addCommittee}>
				<i class="fa-solid fa-plus"></i>
				{m.addAnotherCommittee()}
			</button>
		</div>
	{/if}
</div>
