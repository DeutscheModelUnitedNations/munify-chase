<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import { requestRepresentation } from '#lib/helpers/requests';
	import RequesterName from './RequesterName.svelte';
	import { formatRequestTime } from './requestQueue';

	interface Props {
		req: Parameters<typeof requestRepresentation>[0] & {
			createdAt: string | Date;
			requestType?: { name: string; icon?: string | null } | null;
			conferenceUser?: { name?: string | null; userEmail?: string | null } | null;
		};
		onWithdraw: () => void;
		onResolve: () => void;
	}

	let { req, onWithdraw, onResolve }: Props = $props();
</script>

<li
	class="bg-base-200 flex flex-wrap items-center gap-3 rounded-lg px-4 py-3 sm:flex-nowrap"
	data-tour="requests.request"
>
	<i aria-hidden="true" class="ph-fill ph-{req.requestType?.icon ?? 'flag'} text-xl"></i>
	<div class="flex min-w-0 flex-1 items-center gap-2">
		<Flag representation={requestRepresentation(req)} size="xs" />
		<div class="flex min-w-0 flex-col">
			<span class="font-medium">
				{req.requestType?.name}
				{#if !req.conferenceUser}
					<i
						aria-hidden="true"
						class="ph-fill ph-pencil-simple-line text-base-content/40 ml-1 text-xs"
						title={m.requestAddedByChairs()}
						aria-label={m.requestAddedByChairs()}
					></i>
				{/if}
			</span>
			<RequesterName {req} class="text-base-content/60 truncate text-sm" />
		</div>
	</div>
	<span class="text-base-content/50 text-xs">{formatRequestTime(req.createdAt)}</span>
	<button
		type="button"
		class="btn btn-ghost btn-sm text-error"
		data-tour="requests.withdraw"
		onclick={onWithdraw}
	>
		<i aria-hidden="true" class="ph-fill ph-x"></i>
		{m.withdrawRequestAction()}
	</button>
	<button
		type="button"
		class="btn btn-success btn-sm"
		data-tour="requests.resolve"
		onclick={onResolve}
	>
		<i aria-hidden="true" class="ph-fill ph-check"></i>
		{m.resolveRequestAction()}
	</button>
</li>
