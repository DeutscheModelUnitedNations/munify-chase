<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import AddCountriesModal from '$lib/components/AddCountriesModal.svelte';
	import EditDelegationModal from './EditDelegationModal.svelte';

	interface Representation {
		id: string;
		name: string | null;
		alpha2Code: string | null;
		alpha3Code: string | null;
		type: string;
		faIcon: string | null;
	}

	interface Committee {
		id: string;
		name: string;
		abbreviation: string;
		members: {
			id: string;
			representation: {
				id: string;
				type: string;
			};
		}[];
	}

	interface Props {
		conferenceId: string;
		representations: Representation[];
		committees: Committee[];
	}

	let { conferenceId, representations, committees }: Props = $props();

	let delegations = $derived(representations.filter((r) => r.type === 'DELEGATION'));
	let addCountriesModalOpen = $state(false);
	let editModalOpen = $state(false);
	let editingDelegation = $state<Representation | null>(null);

	function openEditModal(delegation: Representation) {
		editingDelegation = delegation;
		editModalOpen = true;
	}

	function getCommitteesForDelegation(representationId: string): string {
		return committees
			.filter((c) => c.members.some((cm) => cm.representation.id === representationId))
			.map((c) => c.abbreviation)
			.join(', ');
	}

	async function handleAddCountries(
		countries: { alpha2Code: string; alpha3Code: string; name: string }[]
	) {
		for (const country of countries) {
			await toast.promise(
				client.mutate.createRepresentation({
					__args: {
						id: nanoid(),
						conferenceId,
						type: 'DELEGATION',
						alpha2Code: country.alpha2Code,
						alpha3Code: country.alpha3Code,
						name: country.name
					},
					id: true
				}),
				promiseToastStrings(m.delegations(), 'create')
			);
		}
	}

	async function deleteDelegation(id: string) {
		if (!confirm(m.confirmDeleteRepresentation())) return;

		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types delete mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteRepresentation as any)({ __args: { id } } as any),
			promiseToastStrings(m.delegations(), 'delete')
		);
	}
</script>

<BasicCard title={m.delegations()}>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th></th>
					<th>{m.name()}</th>
					<th>Alpha-3</th>
					<th>{m.committees()}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if delegations.length === 0}
					<tr>
						<td colspan="5" class="text-base-content/60 text-center">{m.noData()}</td>
					</tr>
				{:else}
					{#each delegations as delegation (delegation.id)}
						<tr>
							<td class="w-8">
								<Flag representation={delegation} size="xs" />
							</td>
							<td>
								{delegation.name || getTranslatedCountryNameFromAlpha3Code(delegation.alpha3Code)}
							</td>
							<td class="font-mono">
								{delegation.alpha3Code?.toUpperCase() ?? '—'}
							</td>
							<td>
								{getCommitteesForDelegation(delegation.id) || '—'}
							</td>
							<td>
								<div class="flex gap-1">
									<button
										class="btn btn-ghost btn-sm"
										onclick={() => openEditModal(delegation)}
										aria-label={m.edit()}
									>
										<i class="fas fa-pen text-sm"></i>
									</button>
									<button
										class="btn btn-ghost btn-sm text-error"
										onclick={() => deleteDelegation(delegation.id)}
										aria-label={m.deleteRepresentation()}
									>
										<i class="fas fa-trash text-sm"></i>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<div class="mt-6">
		<button class="btn btn-primary" onclick={() => (addCountriesModalOpen = true)}>
			<i class="fas fa-plus"></i>
			{m.addRepresentation()}
		</button>
	</div>
</BasicCard>

<AddCountriesModal bind:open={addCountriesModalOpen} onSubmit={handleAddCountries} />

<EditDelegationModal bind:open={editModalOpen} delegation={editingDelegation} {committees} />
