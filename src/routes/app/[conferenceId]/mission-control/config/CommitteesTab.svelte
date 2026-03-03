<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { cache, graphql } from '$houdini';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Committee {
		id: string;
		name: string;
		abbreviation: string;
		members: { id: string }[];
	}

	interface Props {
		conferenceId: string;
		committees: Committee[];
	}

	let { conferenceId, committees }: Props = $props();

	let newName = $state('');
	let newAbbreviation = $state('');
	let isCreating = $state(false);

	// Inline edit state
	let editingId = $state<string | null>(null);
	let editName = $state('');
	let editAbbreviation = $state('');

	const CreateCommitteeMutation = graphql(`
		mutation CreateCommitteeFromConfig($conferenceId: ID!, $name: String!, $abbreviation: String!) {
			createCommittee(conferenceId: $conferenceId, name: $name, abbreviation: $abbreviation) {
				id
				name
				abbreviation
			}
		}
	`);

	const DeleteCommitteeMutation = graphql(`
		mutation DeleteCommitteeFromConfig($id: ID!) {
			deleteCommittee(id: $id)
		}
	`);

	const UpdateCommitteeMutation = graphql(`
		mutation UpdateCommitteeFromConfig($id: ID!, $name: String, $abbreviation: String) {
			updateCommittee(id: $id, name: $name, abbreviation: $abbreviation) {
				id
				name
				abbreviation
			}
		}
	`);

	async function createCommittee() {
		if (!newName.trim() || !newAbbreviation.trim()) return;
		isCreating = true;
		try {
			await toast.promise(
				CreateCommitteeMutation.mutate({
					conferenceId,
					name: newName.trim(),
					abbreviation: newAbbreviation.trim()
				}),
				promiseToastStrings(m.committee(), 'create')
			);
			newName = '';
			newAbbreviation = '';
			cache.markStale();
			await invalidateAll();
		} finally {
			isCreating = false;
		}
	}

	async function deleteCommittee(id: string) {
		if (!confirm(m.confirmDeleteCommittee())) return;

		await toast.promise(
			DeleteCommitteeMutation.mutate({ id }),
			promiseToastStrings(m.committee(), 'delete')
		);
		cache.markStale();
		await invalidateAll();
	}

	function startEdit(committee: Committee) {
		editingId = committee.id;
		editName = committee.name;
		editAbbreviation = committee.abbreviation;
	}

	function cancelEdit() {
		editingId = null;
	}

	async function saveEdit() {
		if (!editingId || !editName.trim() || !editAbbreviation.trim()) return;

		await toast.promise(
			UpdateCommitteeMutation.mutate({
				id: editingId,
				name: editName.trim(),
				abbreviation: editAbbreviation.trim()
			}),
			promiseToastStrings(m.committee(), 'update')
		);
		editingId = null;
		cache.markStale();
		await invalidateAll();
	}
</script>

<BasicCard title={m.committees()}>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>{m.committeeAbbreviation()}</th>
					<th>{m.committeeName()}</th>
					<th>{m.committeeMembers()}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if committees.length === 0}
					<tr>
						<td colspan="4" class="text-base-content/60 text-center">{m.noData()}</td>
					</tr>
				{:else}
					{#each committees as committee (committee.id)}
						<tr>
							{#if editingId === committee.id}
								<td>
									<input
										type="text"
										class="input input-bordered input-sm w-24"
										bind:value={editAbbreviation}
									/>
								</td>
								<td>
									<input
										type="text"
										class="input input-bordered input-sm w-full"
										bind:value={editName}
									/>
								</td>
								<td>{committee.members.length}</td>
								<td>
									<div class="flex gap-1">
										<button class="btn btn-ghost btn-sm" onclick={saveEdit} aria-label={m.save()}>
											<i class="fas fa-check text-sm text-success"></i>
										</button>
										<button
											class="btn btn-ghost btn-sm"
											onclick={cancelEdit}
											aria-label={m.abort()}
										>
											<i class="fas fa-times text-sm"></i>
										</button>
									</div>
								</td>
							{:else}
								<td class="font-mono font-semibold">{committee.abbreviation}</td>
								<td>{committee.name}</td>
								<td>{committee.members.length}</td>
								<td>
									<div class="flex gap-1">
										<button
											class="btn btn-ghost btn-sm"
											onclick={() => startEdit(committee)}
											aria-label={m.edit()}
										>
											<i class="fas fa-pen text-sm"></i>
										</button>
										<button
											class="btn btn-ghost btn-sm text-error"
											onclick={() => deleteCommittee(committee.id)}
											aria-label={m.removeMember()}
										>
											<i class="fas fa-trash text-sm"></i>
										</button>
									</div>
								</td>
							{/if}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Add committee form -->
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box mt-6 border p-4">
		<legend class="fieldset-legend px-2 text-sm font-semibold">{m.addCommittee()}</legend>
		<div class="flex flex-wrap items-end gap-4">
			<div class="flex flex-col gap-1">
				<span class="text-sm">{m.committeeAbbreviation()}</span>
				<input
					type="text"
					class="input input-bordered w-24"
					placeholder="GA"
					bind:value={newAbbreviation}
				/>
			</div>
			<div class="flex flex-1 flex-col gap-1">
				<span class="text-sm">{m.committeeName()}</span>
				<input
					type="text"
					class="input input-bordered w-full"
					placeholder={m.committeeName()}
					bind:value={newName}
				/>
			</div>
			<button
				type="button"
				class="btn btn-primary"
				onclick={createCommittee}
				disabled={isCreating || !newName.trim() || !newAbbreviation.trim()}
			>
				{#if isCreating}
					<span class="loading loading-spinner loading-sm"></span>
				{:else}
					<i class="fas fa-plus"></i>
				{/if}
				{m.addCommittee()}
			</button>
		</div>
	</fieldset>
</BasicCard>
