<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import UndrawError from '#lib/components/UndrawError.svelte';
	import emptyStreet from '#assets/undraw/empty_street.svg';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import AddManualRequest from '#lib/components/requests/AddManualRequest.svelte';
	import { compareRequests, toPendingSeatRequest } from '#lib/helpers/requests';
	import { requesterLabel } from '../requesters';
	import PendingRequestItem from './PendingRequestItem.svelte';
	import RequestHistory from './RequestHistory.svelte';

	const committeeId = page.params.committeeId!;
	const conferenceId = page.params.conferenceId!;

	const representationFields = {
		type: true,
		name: true,
		alpha2Code: true,
		alpha3Code: true,
		icon: true
	} as const;

	// Seats a chair can add a request for, same sources as the speakers list
	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		members: { id: true, present: true, representation: representationFields },
		conference: {
			id: true,
			uniqueConferenceMembers: { id: true, representation: representationFields }
		}
	});

	const requestTypes = await client.liveQuery.requestTypes({
		__args: { where: { conferenceId: { eq: conferenceId }, enabled: { eq: true } } },
		id: true,
		name: true,
		icon: true,
		priority: true,
		delegatesOnly: true
	});

	const pendingRequests = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: 'PENDING' },
			orderBy: { createdAt: 'asc' }
		},
		id: true,
		createdAt: true,
		requestType: { id: true, name: true, icon: true, priority: true },
		conferenceUser: {
			id: true,
			name: true,
			userEmail: true,
			committeeMember: { id: true, representation: representationFields },
			conferenceMember: { id: true, representation: representationFields }
		},
		committeeMember: { id: true, representation: representationFields },
		conferenceMember: { id: true, representation: representationFields }
	});

	const history = await client.liveQuery.requests({
		__args: {
			where: {
				committeeId: { eq: committeeId },
				OR: [{ status: 'RESOLVED' }, { status: 'WITHDRAWN' }]
			},
			orderBy: { updatedAt: 'desc' },
			limit: 20
		},
		id: true,
		status: true,
		updatedAt: true,
		requestType: { id: true, name: true, icon: true },
		conferenceUser: {
			id: true,
			name: true,
			userEmail: true,
			committeeMember: { id: true, representation: representationFields },
			conferenceMember: { id: true, representation: representationFields }
		},
		committeeMember: { id: true, representation: representationFields },
		conferenceMember: { id: true, representation: representationFields },
		resolvedBy: { id: true, name: true, userEmail: true }
	});

	const pendingSeats = $derived((pendingRequests ?? []).map(toPendingSeatRequest));
	const recentHistory = $derived(history ?? []);
	const committeeMembers = $derived(committee?.members ?? []);
	const conferenceMembers = $derived(committee?.conference?.uniqueConferenceMembers ?? []);
	const enabledRequestTypes = $derived(requestTypes ?? []);

	let sortedPending = $derived([...(pendingRequests ?? [])].sort(compareRequests));

	async function resolve(id: string) {
		await toast.promise(
			client.mutate.resolveRequest({ __args: { id }, id: true }),
			promiseToastStrings(m.requests(), 'update')
		);
	}

	async function withdraw(id: string) {
		await toast.promise(
			client.mutate.withdrawRequest({ __args: { id }, id: true }),
			promiseToastStrings(m.requests(), 'delete')
		);
	}

	// The queue's first entry, in the order the list shows it
	const nextRequest = $derived(sortedPending[0]);
	const nextRequestContext = () =>
		nextRequest
			? `${nextRequest.requestType?.name ?? ''} (${requesterLabel(nextRequest).primary})`
			: '';

	registerCommands(() => [
		{
			id: 'requests.resolve-next',
			title: m.commandResolveNextRequest,
			context: nextRequestContext,
			group: 'page',
			icon: 'check',
			enabled: () => !!nextRequest,
			run: () => nextRequest && resolve(nextRequest.id)
		},
		{
			id: 'requests.withdraw-next',
			title: m.commandWithdrawNextRequest,
			context: nextRequestContext,
			group: 'page',
			icon: 'x',
			enabled: () => !!nextRequest,
			run: () => nextRequest && withdraw(nextRequest.id)
		}
	]);
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex h-full w-full max-w-screen-lg flex-col gap-6 p-6">
		<BasicCard title={m.addRequest()}>
			<p class="mb-4 text-sm opacity-70">{m.addRequestDescription()}</p>
			<AddManualRequest
				{committeeId}
				{committeeMembers}
				{conferenceMembers}
				requestTypes={enabledRequestTypes}
				pending={pendingSeats}
			/>
		</BasicCard>

		{#if sortedPending.length === 0 && recentHistory.length === 0}
			<UndrawError
				undrawImage={emptyStreet}
				title={m.noPendingRequests()}
				description={m.noRequestsYetDescription()}
			/>
		{:else}
			<BasicCard title={m.requests()} data-tour="requests.queue">
				{#if sortedPending.length > 0}
					<ul class="flex flex-col gap-2">
						{#each sortedPending as req (req.id)}
							<PendingRequestItem
								{req}
								onWithdraw={() => withdraw(req.id)}
								onResolve={() => resolve(req.id)}
							/>
						{/each}
					</ul>
				{:else}
					<p class="text-base-content/60 py-8 text-center text-sm">{m.noPendingRequests()}</p>
				{/if}
			</BasicCard>

			{#if recentHistory.length > 0}
				<RequestHistory history={recentHistory} />
			{/if}
		{/if}
	</div>
</div>
