<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { SvelteSet } from 'svelte/reactivity';

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
		open: boolean;
		delegation: Representation | null;
		committees: Committee[];
	}

	let { open = $bindable(), delegation, committees }: Props = $props();

	let isSaving = $state(false);

	// Track which committees are currently checked
	let checkedCommittees = new SvelteSet<string>();

	// Sync checked state when modal opens / delegation changes
	$effect(() => {
		if (delegation && open) {
			checkedCommittees.clear();
			for (const committee of committees) {
				if (committee.members.some((cm) => cm.representation.id === delegation.id)) {
					checkedCommittees.add(committee.id);
				}
			}
		}
	});

	function getCommitteeMemberId(committeeId: string): string | undefined {
		if (!delegation) return undefined;
		const committee = committees.find((c) => c.id === committeeId);
		return committee?.members.find((cm) => cm.representation.id === delegation.id)?.id;
	}

	function toggleCommittee(committeeId: string) {
		if (checkedCommittees.has(committeeId)) {
			checkedCommittees.delete(committeeId);
		} else {
			checkedCommittees.add(committeeId);
		}
	}

	async function handleSave() {
		if (!delegation) return;
		isSaving = true;

		try {
			// Determine which committees to add/remove
			for (const committee of committees) {
				const hasSeat = committee.members.some((cm) => cm.representation.id === delegation.id);
				const wantsSeat = checkedCommittees.has(committee.id);

				if (!hasSeat && wantsSeat) {
					// Add seat
					await toast.promise(
						client.mutate.createCommitteeMember({
							__args: {
								committeeId: committee.id,
								representationId: delegation.id
							},
							id: true
						}),
						promiseToastStrings(committee.abbreviation, 'add')
					);
				} else if (hasSeat && !wantsSeat) {
					// Remove seat
					const memberId = getCommitteeMemberId(committee.id);
					if (memberId) {
						await toast.promise(
							client.mutate.deleteCommitteeMember({ __args: { id: memberId } } as any),
							promiseToastStrings(committee.abbreviation, 'delete')
						);
					}
				}
			}

			open = false;
		} finally {
			isSaving = false;
		}
	}
</script>

<Modal bind:open>
	{#if delegation}
		<h3 class="mb-4 text-lg font-bold">{m.edit()}</h3>

		<div class="mb-4 flex items-center gap-3">
			<Flag representation={delegation as any} size="xs" />
			<span class="text-lg font-semibold">
				{delegation.name || getTranslatedCountryNameFromAlpha3Code(delegation.alpha3Code)}
			</span>
		</div>

		<div class="form-control mb-4">
			<label class="label">
				<span class="label-text font-semibold">{m.committees()}</span>
			</label>
			{#if committees.length === 0}
				<p class="text-base-content/60 text-sm italic">{m.noData()}</p>
			{:else}
				<div class="flex flex-col gap-2">
					{#each committees as committee (committee.id)}
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={checkedCommittees.has(committee.id)}
								onchange={() => toggleCommittee(committee.id)}
							/>
							<span>
								<span class="font-mono font-semibold">{committee.abbreviation}</span>
								— {committee.name}
							</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn" onclick={() => (open = false)}>{m.abort()}</button>
			<button class="btn btn-primary" onclick={handleSave} disabled={isSaving}>
				{#if isSaving}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				{m.save()}
			</button>
		</div>
	{/if}
</Modal>
