<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import CountryBadge from '$lib/components/CountryBadge.svelte';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
		onOpenAddCountries: (committeeId: string) => void;
	}

	let { data = $bindable(), onOpenAddCountries }: Props = $props();

	function membersOf(committeeId: string) {
		return (data.committeeMembers ?? []).filter((cm) => cm.committeeId === committeeId);
	}

	function repFor(repId: string) {
		return data.representations.find((r) => r.id === repId);
	}

	function removeMember(memberId: string) {
		data.committeeMembers = (data.committeeMembers ?? []).filter((cm) => cm.id !== memberId);
	}

	const totalDelegations = $derived(
		new Set(
			(data.committeeMembers ?? [])
				.map((cm) => repFor(cm.representationId)?.alpha2Code)
				.filter(Boolean)
		).size
	);
</script>

<div class="flex flex-col gap-6">
	<StepHeader
		eyebrow={m.delegationsEyebrow()}
		title={m.delegationsTitle()}
		subtitle={m.delegationsSubtitle()}
	/>

	<div class="bg-accent/15 border-accent/40 flex items-center gap-3 rounded-box border p-4 text-sm">
		<i class="fa-solid fa-circle-info"></i>
		<div>
			{m.uniqueDelegationsAcross({
				delegations: totalDelegations,
				committees: data.committees.length
			})}
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#each data.committees as committee (committee.id)}
			{@const members = membersOf(committee.id)}
			<div class="card bg-base-100 gap-3 p-5 shadow-sm">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<div
							class="bg-primary/15 text-primary grid h-10 w-10 place-items-center rounded-lg font-mono text-sm font-bold"
						>
							{committee.abbreviation || '–'}
						</div>
						<div>
							<div class="text-base font-semibold">
								{committee.name || committee.abbreviation || '–'}
							</div>
							<div class="text-base-content/60 text-xs">
								{members.length}
								{m.delegations()}
							</div>
						</div>
					</div>
					<button
						type="button"
						class="btn btn-primary btn-sm"
						onclick={() => onOpenAddCountries(committee.id)}
					>
						<i class="fa-solid fa-plus"></i>
						{m.addCountry()}
					</button>
				</div>

				{#if members.length === 0}
					<div
						class="border-base-content/20 text-base-content/55 rounded-box border-2 border-dashed p-5 text-center text-sm"
					>
						{m.noMembersYetHint()}
					</div>
				{:else}
					<div class="flex flex-wrap gap-1.5">
						{#each members.toSorted( (a, b) => (repFor(a.representationId)?.alpha2Code ?? '').localeCompare(repFor(b.representationId)?.alpha2Code ?? '') ) as member (member.id)}
							{@const rep = repFor(member.representationId)}
							{#if rep?.alpha2Code}
								<CountryBadge
									alpha2Code={rep.alpha2Code}
									alpha3Code={rep.alpha3Code}
									onRemove={() => removeMember(member.id)}
								/>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
