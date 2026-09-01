<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	const committeeId = page.params.committeeId!;

	const pendingRequests = await client.liveQuery.requests({
		__args: {
			where: { committeeId: { eq: committeeId }, status: 'PENDING' },
			orderBy: { createdAt: 'asc' }
		},
		id: true,
		createdAt: true,
		requestType: { id: true, name: true, faIcon: true, priority: true },
		conferenceUser: {
			committeeMember: {
				representation: {
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			},
			conferenceMember: {
				representation: {
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			}
		}
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
			committeeMember: {
				representation: {
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			},
			conferenceMember: {
				representation: {
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			}
		}
	});

	type Requester = NonNullable<NonNullable<typeof pendingRequests>[number]['conferenceUser']>;

	function requesterRepresentation(conferenceUser: Requester | null | undefined) {
		return (
			conferenceUser?.committeeMember?.representation ??
			conferenceUser?.conferenceMember?.representation ??
			null
		);
	}

	function requesterLabel(conferenceUser: Requester | null | undefined) {
		return requesterRepresentation(conferenceUser)?.name ?? m.unknown();
	}

	let sortedPending = $derived(
		[...(pendingRequests ?? [])].sort((a, b) => {
			const priorityDiff = (a.requestType?.priority ?? 0) - (b.requestType?.priority ?? 0);
			if (priorityDiff !== 0) return priorityDiff;
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		})
	);

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
</script>

{#if sortedPending.length === 0 && (history?.length ?? 0) === 0}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.noPendingRequests()}
		description={m.noRequestsYetDescription()}
	/>
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-lg flex-col gap-6 p-6">
			<BasicCard title={m.requests()}>
				{#if sortedPending.length > 0}
					<ul class="flex flex-col gap-2">
						{#each sortedPending as req (req.id)}
							<li
								class="bg-base-200 flex flex-wrap items-center gap-3 rounded-lg px-4 py-3 sm:flex-nowrap"
							>
								<i
									class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace('fa-', '')} text-xl"
								></i>
								<div class="flex min-w-0 flex-1 items-center gap-2">
									<Flag representation={requesterRepresentation(req.conferenceUser)} size="xs" />
									<div class="flex min-w-0 flex-col">
										<span class="font-medium">{req.requestType?.name}</span>
										<span class="text-base-content/60 truncate text-sm">
											{requesterLabel(req.conferenceUser)}
										</span>
									</div>
								</div>
								<span class="text-base-content/50 text-xs">{formatTime(req.createdAt)}</span>
								<button
									type="button"
									class="btn btn-ghost btn-sm text-error"
									onclick={() => withdraw(req.id)}
								>
									<i class="fas fa-xmark"></i>
									{m.withdrawRequestAction()}
								</button>
								<button
									type="button"
									class="btn btn-success btn-sm"
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
				<details class="group">
					<summary
						class="text-base-content/60 hover:text-base-content flex cursor-pointer select-none list-none items-center gap-1 text-sm transition-colors"
					>
						<i class="fas fa-chevron-right text-xs transition-transform group-open:rotate-90"></i>
						{m.recentRequestHistory({ count: history.length })}
					</summary>
					<ul class="mt-2 flex flex-col gap-1">
						{#each history as req (req.id)}
							<li class="bg-base-200 flex items-center gap-3 rounded-lg px-4 py-2 text-sm">
								<i class="fas fa-{(req.requestType?.faIcon ?? 'fa-flag').replace('fa-', '')}"></i>
								<span class="flex-1">{req.requestType?.name}</span>
								<Flag representation={requesterRepresentation(req.conferenceUser)} size="xs" />
								<span class="text-base-content/60">
									{requesterLabel(req.conferenceUser)}
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
		</div>
	</div>
{/if}
