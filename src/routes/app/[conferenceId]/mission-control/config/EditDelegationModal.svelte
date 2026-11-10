<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Modal from '#lib/components/Modal.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		committeesSeating,
		seatChanges,
		type Committee,
		type Representation
	} from './delegations';

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
		if (!delegation || !open) return;
		checkedCommittees.clear();
		for (const committee of committeesSeating({ committees, representationId: delegation.id })) {
			checkedCommittees.add(committee.id);
		}
	});

	function toggleCommittee(committeeId: string) {
		if (!checkedCommittees.delete(committeeId)) checkedCommittees.add(committeeId);
	}

	function addSeat({
		committee,
		representationId
	}: {
		committee: Committee;
		representationId: string;
	}) {
		return toast.promise(
			client.mutate.createCommitteeMember({
				__args: { id: nanoid(), committeeId: committee.id, representationId },
				id: true
			}),
			promiseToastStrings(committee.abbreviation, 'add')
		);
	}

	function removeSeat({ committee, memberId }: { committee: Committee; memberId: string }) {
		return toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types delete mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteCommitteeMember as any)({ __args: { id: memberId } } as any),
			promiseToastStrings(committee.abbreviation, 'delete')
		);
	}

	async function handleSave() {
		if (!delegation) return;
		isSaving = true;
		try {
			const changes = seatChanges({
				committees,
				representationId: delegation.id,
				wanted: checkedCommittees
			});
			for (const committee of changes.add) {
				await addSeat({ committee, representationId: delegation.id });
			}
			for (const seat of changes.remove) await removeSeat(seat);
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
			<Flag representation={delegation} size="xs" />
			<span class="text-lg font-semibold">
				{delegation.name || getTranslatedCountryNameFromAlpha3Code(delegation.alpha3Code)}
			</span>
		</div>

		<div class="form-control mb-4">
			<div class="label">
				<span class="label-text font-semibold">{m.committees()}</span>
			</div>
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
