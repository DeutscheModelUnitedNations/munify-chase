<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import AddManualRequest from '$lib/components/requests/AddManualRequest.svelte';
	import {
		compareRequests,
		requestRepresentation,
		toPendingSeatRequest
	} from '$lib/helpers/requests';

	const committeeId = page.params.committeeId!;
	const conferenceId = page.params.conferenceId!;

	const representationFields = {
		type: true,
		name: true,
		alpha2Code: true,
		alpha3Code: true,
		faIcon: true
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
		faIcon: true,
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
		requestType: { id: true, name: true, faIcon: true, priority: true },
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
		requestType: { id: true, name: true, faIcon: true },
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

	type Request = NonNullable<typeof pendingRequests>[number];
	type Requester = Pick<Request, 'conferenceUser' | 'committeeMember' | 'conferenceMember'>;

	// The delegation/NSA name is the primary label; the person's own name (when
	// set) is shown alongside it for context, but only if it adds information.
	function requesterLabel(req: Requester) {
		const rep = requestRepresentation(req);
		const personName = req.conferenceUser?.name;
		const primary = rep
			? (rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code))
			: (personName ?? req.conferenceUser?.userEmail ?? m.unknown());
		const secondary = personName && personName !== primary ? personName : null;
		return { primary, secondary };
	}

	const pendingSeats = $derived((pendingRequests ?? []).map(toPendingSeatRequest));

	let sortedPending = $derived([...(pendingRequests ?? [])].sort(compareRequests));

	function formatTime(ts: string | Date) {
		const d = ts instanceof Date ? ts : new Date(ts);
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
	}

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
			icon: 'xmark',
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
				committeeMembers={committee?.members ?? []}
				conferenceMembers={committee?.conference?.uniqueConferenceMembers ?? []}
				requestTypes={requestTypes ?? []}
				pending={pendingSeats}
			/>
		</BasicCard>

		{#if sortedPending.length === 0 && (history?.length ?? 0) === 0}
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
							{@const label = requesterLabel(req)}
							<li
								class="bg-base-200 flex flex-wrap items-center gap-3 rounded-lg px-4 py-3 sm:flex-nowrap"
								data-tour="requests.request"
							>
								<i
									class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace('fa-', '')} text-xl"
								></i>
								<div class="flex min-w-0 flex-1 items-center gap-2">
									<Flag representation={requestRepresentation(req)} size="xs" />
									<div class="flex min-w-0 flex-col">
										<span class="font-medium">
											{req.requestType?.name}
											{#if !req.conferenceUser}
												<i
													class="fas fa-user-pen text-base-content/40 ml-1 text-xs"
													title={m.requestAddedByChairs()}
													aria-label={m.requestAddedByChairs()}
												></i>
											{/if}
										</span>
										<span class="text-base-content/60 truncate text-sm">
											{label.primary}
											{#if label.secondary}
												<span class="text-base-content/40">({label.secondary})</span>
											{/if}
										</span>
									</div>
								</div>
								<span class="text-base-content/50 text-xs">{formatTime(req.createdAt)}</span>
								<button
									type="button"
									class="btn btn-ghost btn-sm text-error"
									data-tour="requests.withdraw"
									onclick={() => withdraw(req.id)}
								>
									<i class="fas fa-xmark"></i>
									{m.withdrawRequestAction()}
								</button>
								<button
									type="button"
									class="btn btn-success btn-sm"
									data-tour="requests.resolve"
									onclick={() => resolve(req.id)}
								>
									<i class="fas fa-check"></i>
									{m.resolveRequestAction()}
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-base-content/60 py-8 text-center text-sm">{m.noPendingRequests()}</p>
				{/if}
			</BasicCard>

			{#if history && history.length > 0}
				<details class="group" data-tour="requests.history">
					<summary
						class="text-base-content/60 hover:text-base-content flex cursor-pointer select-none list-none items-center gap-1 text-sm transition-colors"
					>
						<i class="fas fa-chevron-right text-xs transition-transform group-open:rotate-90"></i>
						{m.recentRequestHistory({ count: history.length })}
					</summary>
					<ul class="mt-2 flex flex-col gap-1">
						{#each history as req (req.id)}
							{@const label = requesterLabel(req)}
							<li class="bg-base-200 flex items-center gap-3 rounded-lg px-4 py-2 text-sm">
								<i class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
								<span class="flex-1">{req.requestType?.name}</span>
								<Flag representation={requestRepresentation(req)} size="xs" />
								<span class="text-base-content/60">
									{label.primary}
									{#if label.secondary}
										<span class="text-base-content/40">({label.secondary})</span>
									{/if}
								</span>
								<span
									class="badge badge-sm {req.status === 'WITHDRAWN'
										? 'badge-ghost'
										: 'badge-success'}"
								>
									{req.status === 'WITHDRAWN' ? m.withdrawn() : m.resolved()}
								</span>
								{#if req.updatedAt}
									<span class="text-base-content/50 text-xs">{formatTime(req.updatedAt)}</span>
								{/if}
							</li>
						{/each}
					</ul>
				</details>
			{/if}
		{/if}
	</div>
</div>
