<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import { requestRepresentation } from '#lib/helpers/requests';
	import RequesterName from './RequesterName.svelte';
	import { formatRequestTime, historyStatusBadge } from './requestQueue';

	type HistoryRequest = Parameters<typeof requestRepresentation>[0] & {
		id: string;
		status?: string | null;
		updatedAt?: string | Date | null;
		requestType?: { name: string; icon?: string | null } | null;
		conferenceUser?: { name?: string | null; userEmail?: string | null } | null;
	};

	interface Props {
		/** Recently resolved or withdrawn requests, newest first */
		history: HistoryRequest[];
	}

	let { history }: Props = $props();
</script>

<details class="group" data-tour="requests.history">
	<summary
		class="text-base-content/60 hover:text-base-content flex cursor-pointer select-none list-none items-center gap-1 text-sm transition-colors"
	>
		<i
			aria-hidden="true"
			class="ph-fill ph-caret-right text-xs transition-transform group-open:rotate-90"
		></i>
		{m.recentRequestHistory({ count: history.length })}
	</summary>
	<ul class="mt-2 flex flex-col gap-1">
		{#each history as req (req.id)}
			{@const badge = historyStatusBadge(req.status)}
			<li class="bg-base-200 flex items-center gap-3 rounded-lg px-4 py-2 text-sm">
				<i aria-hidden="true" class="ph-fill ph-{req.requestType?.icon ?? 'flag'}"></i>
				<span class="flex-1">{req.requestType?.name}</span>
				<Flag representation={requestRepresentation(req)} size="xs" />
				<RequesterName {req} class="text-base-content/60" />
				<span class="badge badge-sm {badge.badgeClass}">
					{badge.label}
				</span>
				{#if req.updatedAt}
					<span class="text-base-content/50 text-xs">{formatRequestTime(req.updatedAt)}</span>
				{/if}
			</li>
		{/each}
	</ul>
</details>
