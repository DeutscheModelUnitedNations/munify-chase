<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { getDefaultRequestTypes } from '$lib/data/defaultRequestTypes';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	interface RequestType {
		id: string;
		name: string;
		faIcon: string | null;
		priority: number;
		enabled: boolean;
	}

	interface Props {
		conferenceId: string;
		requestTypes: RequestType[];
	}

	let { conferenceId, requestTypes }: Props = $props();

	let sorted = $derived([...requestTypes].sort((a, b) => a.priority - b.priority));
	let confirmDeleteOpen = $state(false);
	let deleteTargetId = $state<string | null>(null);

	async function loadDefaults() {
		const existingNames = new Set(requestTypes.map((rt) => rt.name));
		for (const rt of getDefaultRequestTypes()) {
			if (existingNames.has(rt.name)) continue;
			await toast.promise(
				client.mutate.createRequestType({
					__args: { id: nanoid(), conferenceId, name: rt.name, faIcon: rt.faIcon },
					id: true
				}),
				promiseToastStrings(m.requestTypes(), 'create')
			);
		}
	}

	async function addRequestType() {
		await toast.promise(
			client.mutate.createRequestType({
				__args: { id: nanoid(), conferenceId, name: '', faIcon: 'fa-flag' },
				id: true
			}),
			promiseToastStrings(m.requestTypes(), 'create')
		);
	}

	async function updateName(id: string, name: string) {
		if (!name.trim()) return;
		await toast.promise(
			client.mutate.updateRequestType({ __args: { id, name }, id: true }),
			promiseToastStrings(m.requestTypes(), 'update')
		);
	}

	async function updateIcon(id: string, faIcon: string) {
		await toast.promise(
			client.mutate.updateRequestType({ __args: { id, faIcon }, id: true }),
			promiseToastStrings(m.requestTypes(), 'update')
		);
	}

	async function toggleEnabled(id: string, enabled: boolean) {
		await toast.promise(
			client.mutate.updateRequestType({ __args: { id, enabled }, id: true }),
			promiseToastStrings(m.requestTypes(), 'update')
		);
	}

	async function moveRequestType(index: number, direction: -1 | 1) {
		const target = index + direction;
		if (target < 0 || target >= sorted.length) return;
		const a = sorted[index];
		const b = sorted[target];
		await Promise.all([
			client.mutate.updateRequestType({ __args: { id: a.id, priority: b.priority }, id: true }),
			client.mutate.updateRequestType({ __args: { id: b.id, priority: a.priority }, id: true })
		]);
	}

	function requestDelete(id: string) {
		deleteTargetId = id;
		confirmDeleteOpen = true;
	}

	async function confirmDelete() {
		if (!deleteTargetId) return;
		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types delete mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteRequestType as any)({ __args: { id: deleteTargetId } } as any),
			promiseToastStrings(m.requestTypes(), 'delete')
		);
		deleteTargetId = null;
	}
</script>

<BasicCard title={m.requestTypes()}>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th></th>
					<th></th>
					<th>{m.icon()}</th>
					<th>{m.name()}</th>
					<th>{m.enabled()}</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#if sorted.length === 0}
					<tr>
						<td colspan="6" class="text-base-content/60 text-center">{m.noData()}</td>
					</tr>
				{:else}
					{#each sorted as rt, i (rt.id)}
						<tr>
							<td class="w-16">
								<div class="join">
									<button
										type="button"
										class="btn btn-ghost btn-xs join-item"
										aria-label="Move up"
										disabled={i === 0}
										onclick={() => moveRequestType(i, -1)}
									>
										<i class="fa-solid fa-chevron-up"></i>
									</button>
									<button
										type="button"
										class="btn btn-ghost btn-xs join-item"
										aria-label="Move down"
										disabled={i === sorted.length - 1}
										onclick={() => moveRequestType(i, 1)}
									>
										<i class="fa-solid fa-chevron-down"></i>
									</button>
								</div>
							</td>
							<td class="w-8">
								<i class="fas fa-{(rt.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
							</td>
							<td class="w-32">
								<input
									type="text"
									class="input input-bordered input-sm w-full font-mono text-xs"
									value={rt.faIcon ?? ''}
									placeholder={m.icon()}
									onchange={(e) => updateIcon(rt.id, e.currentTarget.value)}
								/>
							</td>
							<td>
								<input
									type="text"
									class="input input-bordered input-sm w-full"
									value={rt.name}
									placeholder={m.requestTypeNamePlaceholder()}
									onchange={(e) => updateName(rt.id, e.currentTarget.value)}
								/>
							</td>
							<td>
								<input
									type="checkbox"
									class="toggle toggle-sm"
									checked={rt.enabled}
									onchange={(e) => toggleEnabled(rt.id, e.currentTarget.checked)}
								/>
							</td>
							<td>
								<button
									class="btn btn-ghost btn-sm text-error"
									onclick={() => requestDelete(rt.id)}
									aria-label={m.delete()}
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

	<div class="mt-6 flex gap-2">
		<button class="btn btn-primary" onclick={loadDefaults}>
			<i class="fas fa-wand-magic-sparkles"></i>
			{m.loadDefaultRequestTypes()}
		</button>
		<button class="btn btn-ghost" onclick={addRequestType}>
			<i class="fas fa-plus"></i>
			{m.addRequestType()}
		</button>
	</div>
</BasicCard>

<ConfirmModal
	bind:open={confirmDeleteOpen}
	title={m.delete()}
	message={m.confirmDeleteRequestType()}
	onConfirm={confirmDelete}
/>
