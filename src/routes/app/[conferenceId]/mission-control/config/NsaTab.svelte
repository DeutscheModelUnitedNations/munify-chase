<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Representation {
		id: string;
		name: string | null;
		alpha2Code: string | null;
		alpha3Code: string | null;
		type: string;
		faIcon: string | null;
	}

	interface Props {
		conferenceId: string;
		representations: Representation[];
	}

	let { conferenceId, representations }: Props = $props();

	let nsaActors = $derived(representations.filter((r) => r.type === 'NSA' || r.type === 'UN'));

	let newName = $state('');
	let newType = $state<'NSA' | 'UN'>('NSA');
	let newFaIcon = $state('');
	let isCreating = $state(false);

	async function createActor() {
		if (!newName.trim()) return;
		isCreating = true;
		try {
			await toast.promise(
				client.mutate.createRepresentation({
					__args: {
						conferenceId,
						type: newType,
						name: newName.trim(),
						faIcon: newFaIcon.trim() || null
					},
					id: true
				}),
				promiseToastStrings(newType === 'NSA' ? m.nonStateActor() : m.unActor(), 'create')
			);
			newName = '';
			newFaIcon = '';
		} finally {
			isCreating = false;
		}
	}

	async function deleteActor(id: string) {
		if (!confirm(m.confirmDeleteRepresentation())) return;

		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types delete mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteRepresentation as any)({ __args: { id } } as any),
			promiseToastStrings(m.nonStateActor(), 'delete')
		);
	}

	const typeLabel: Record<string, () => string> = {
		NSA: () => m.nonStateActor(),
		UN: () => m.unActor()
	};
</script>

<BasicCard title={m.nonStateActors()}>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>{m.icon()}</th>
					<th>{m.name()}</th>
					<th>{m.role()}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if nsaActors.length === 0}
					<tr>
						<td colspan="4" class="text-base-content/60 text-center">{m.noData()}</td>
					</tr>
				{:else}
					{#each nsaActors as actor (actor.id)}
						<tr>
							<td class="w-8">
								<Flag representation={actor} size="xs" />
							</td>
							<td>{actor.name ?? '—'}</td>
							<td>
								<span
									class="badge badge-sm {actor.type === 'UN' ? 'badge-info' : 'badge-secondary'}"
								>
									{typeLabel[actor.type]?.() ?? actor.type}
								</span>
							</td>
							<td>
								<button
									class="btn btn-ghost btn-sm text-error"
									onclick={() => deleteActor(actor.id)}
									aria-label={m.deleteRepresentation()}
								>
									<i class="fas fa-trash text-sm"></i>
								</button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Add NSA/UN actor form -->
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box mt-6 border p-4">
		<legend class="fieldset-legend px-2 text-sm font-semibold">
			{m.addNonStateActor()}
		</legend>
		<div class="flex flex-wrap items-end gap-4">
			<div class="flex flex-1 flex-col gap-1">
				<span class="text-sm">{m.name()}</span>
				<input
					type="text"
					class="input input-bordered w-full"
					placeholder={m.name()}
					bind:value={newName}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<span class="text-sm">{m.role()}</span>
				<select class="select select-bordered" bind:value={newType}>
					<option value="NSA">{m.nonStateActor()}</option>
					<option value="UN">{m.unActor()}</option>
				</select>
			</div>
			<div class="flex flex-col gap-1">
				<span class="text-sm">{m.icon()}</span>
				<input
					type="text"
					class="input input-bordered w-32"
					placeholder="building-ngo"
					bind:value={newFaIcon}
				/>
			</div>
			<button
				type="button"
				class="btn btn-primary"
				onclick={createActor}
				disabled={isCreating || !newName.trim()}
			>
				{#if isCreating}
					<span class="loading loading-spinner loading-sm"></span>
				{:else}
					<i class="fas fa-plus"></i>
				{/if}
				{m.addNonStateActor()}
			</button>
		</div>
	</fieldset>
</BasicCard>
