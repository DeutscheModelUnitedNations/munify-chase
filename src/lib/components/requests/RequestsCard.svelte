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
		isDelegate: boolean;
	}

	let { conferenceId, committeeId, isDelegate }: Props = $props();

	// Ability-scoped read: a participant only ever gets back requests they
	// submitted themselves (see abilityBuilder.request.allow('read') in
	// src/api/handlers/request.ts), so no explicit "mine" filter is needed here.
	const myRequests = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: 'PENDING' }
		},
		id: true,
		status: true,
		createdAt: true,
		requestType: { id: true, name: true, faIcon: true, priority: true }
	});

	// Same order as the chairs' pending-requests list: requestType.priority, then createdAt.
	let sortedMyRequests = $derived(
		[...(myRequests ?? [])].sort((a, b) => {
			const priorityDiff = (a.requestType?.priority ?? 0) - (b.requestType?.priority ?? 0);
			if (priorityDiff !== 0) return priorityDiff;
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		})
	);

	const requestTypes = await client.liveQuery.requestTypes({
		__args: {
			where: { conferenceId: { eq: conferenceId }, enabled: { eq: true } }
		},
		id: true,
		name: true,
		faIcon: true,
		priority: true,
		delegatesOnly: true
	});

	// NSAs can't file delegates-only request types.
	let sortedTypes = $derived(
		[...(requestTypes ?? [])]
			.filter((rt) => isDelegate || !rt.delegatesOnly)
			.sort((a, b) => a.priority - b.priority)
	);

	// Only one pending request per type is allowed at a time (see the partial
	// unique index on request in src/api/db/schema.ts), so hide types the
	// participant already has an open request for rather than let them pick
	// one and hit the "already pending" error.
	let pendingTypeIds = $derived(
		new Set((myRequests ?? []).map((req) => req.requestType?.id).filter((id) => id !== undefined))
	);
	let pickableTypes = $derived(sortedTypes.filter((rt) => !pendingTypeIds.has(rt.id)));

	let pickerOpen = $state(false);
	let search = $state('');
	let filteredTypes = $derived(
		pickableTypes.filter((rt) => rt.name.toLowerCase().includes(search.toLowerCase()))
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

		{#if sortedMyRequests.length > 0}
			<ul class="flex flex-col gap-2">
				{#each sortedMyRequests as req (req.id)}
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

		<button
			type="button"
			class="btn btn-primary btn-sm"
			disabled={pickableTypes.length === 0}
			aria-describedby={pickableTypes.length === 0 ? 'no-request-types-hint' : undefined}
			onclick={openPicker}
		>
			<i class="fas fa-hand"></i>
			{m.makeARequest()}
		</button>
		{#if sortedTypes.length === 0}
			<p id="no-request-types-hint" class="text-base-content/50 text-xs">
				{m.noRequestTypesConfigured()}
			</p>
		{:else if pickableTypes.length === 0}
			<p id="no-request-types-hint" class="text-base-content/50 text-xs">
				{m.allRequestTypesPending()}
			</p>
		{/if}
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
