<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import Modal from '$lib/components/Modal.svelte';

	interface Props {
		conferenceId: string;
		committeeId: string;
	}

	let { conferenceId, committeeId }: Props = $props();

	// Ability-scoped read: a participant only ever gets back requests they
	// submitted themselves (see abilityBuilder.request.allow('read') in
	// src/api/handlers/request.ts), so no explicit "mine" filter is needed here.
	const myRequests = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: { eq: 'PENDING' } }
		},
		id: true,
		status: true,
		requestType: { id: true, name: true, faIcon: true }
	});

	const requestTypes = await client.liveQuery.requestTypes({
		__args: {
			where: { conferenceId: { eq: conferenceId }, enabled: { eq: true } }
		},
		id: true,
		name: true,
		faIcon: true,
		priority: true
	});

	let sortedTypes = $derived([...(requestTypes ?? [])].sort((a, b) => a.priority - b.priority));

	let pickerOpen = $state(false);
	let search = $state('');
	let filteredTypes = $derived(
		sortedTypes.filter((rt) => rt.name.toLowerCase().includes(search.toLowerCase()))
	);

	function openPicker() {
		search = '';
		pickerOpen = true;
	}

	async function submitRequest(requestTypeId: string) {
		await toast.promise(
			client.mutate.createRequest({
				__args: { id: nanoid(), committeeId, requestTypeId },
				id: true
			}),
			promiseToastStrings(m.requests(), 'create')
		);
		pickerOpen = false;
		search = '';
	}

	async function withdraw(id: string) {
		await toast.promise(
			client.mutate.withdrawRequest({ __args: { id }, id: true }),
			promiseToastStrings(m.requests(), 'delete')
		);
	}
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body gap-3 p-4">
		<h2 class="card-title text-lg">{m.requests()}</h2>

		{#if (myRequests ?? []).length > 0}
			<ul class="flex flex-col gap-2">
				{#each myRequests ?? [] as req (req.id)}
					<li class="bg-base-200 flex items-center gap-2 rounded-lg px-3 py-2">
						<i class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
						<span class="flex-1 text-sm">{req.requestType?.name}</span>
						<span class="badge badge-warning badge-sm">{m.pending()}</span>
						<button
							type="button"
							class="btn btn-ghost btn-xs text-error"
							onclick={() => withdraw(req.id)}
							aria-label={m.withdrawRequestAction()}
						>
							<i class="fas fa-xmark"></i>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-base-content/60 text-sm">{m.noPendingRequests()}</p>
		{/if}

		<button type="button" class="btn btn-primary btn-sm" onclick={openPicker}>
			<i class="fas fa-hand"></i>
			{m.makeARequest()}
		</button>
	</div>
</div>

<Modal bind:open={pickerOpen}>
	<h3 class="text-lg font-bold">{m.makeARequest()}</h3>
	<input
		type="text"
		class="input input-bordered mt-3 w-full"
		placeholder={m.searchRequestTypes()}
		bind:value={search}
	/>
	<ul class="mt-3 flex max-h-80 flex-col gap-1 overflow-y-auto">
		{#each filteredTypes as rt (rt.id)}
			<li>
				<button
					type="button"
					class="btn btn-ghost w-full justify-start gap-2"
					onclick={() => submitRequest(rt.id)}
				>
					<i class="fas fa-{(rt.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
					{rt.name}
				</button>
			</li>
		{:else}
			<li class="text-base-content/60 px-2 py-4 text-center text-sm">{m.noData()}</li>
		{/each}
	</ul>
	<div class="modal-action">
		<button type="button" class="btn" onclick={() => (pickerOpen = false)}>{m.cancel()}</button>
	</div>
</Modal>
