<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import toastLib, { type Toast } from 'svelte-french-toast';

	interface Props {
		toast: Toast;
		requestTypeName: string;
		requesterLabel: string;
		conferenceId: string;
		committeeId: string;
	}

	let { toast, requestTypeName, requesterLabel, conferenceId, committeeId }: Props = $props();

	const requestsHref = resolve('/app/[conferenceId]/[committeeId]/(chairs)/requests', {
		conferenceId,
		committeeId
	});

	function dismiss() {
		toastLib.dismiss(toast.id);
	}
</script>

<div class="flex w-full items-start gap-2">
	<div class="flex min-w-0 flex-1 flex-col">
		<span class="font-medium">{m.newRequestNotification()}</span>
		<span class="truncate text-sm opacity-80">
			{requestTypeName} - {requesterLabel}
		</span>
		<a href={requestsHref} class="link link-primary mt-1 text-xs" onclick={dismiss}>
			{m.viewRequests()}
		</a>
	</div>
	<button type="button" class="btn btn-ghost btn-xs" onclick={dismiss} aria-label={m.close()}>
		<i class="fas fa-xmark"></i>
	</button>
</div>
