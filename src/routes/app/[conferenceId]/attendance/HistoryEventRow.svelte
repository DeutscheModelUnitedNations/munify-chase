<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		event: {
			present: boolean;
			timestamp: string | Date;
			note?: string | null;
			conferenceUser?: {
				name?: string | null;
				userEmail?: string | null;
				conferenceMember?: { representation?: { name?: string | null } | null } | null;
			} | null;
			committee?: { name: string; abbreviation?: string | null } | null;
		};
		onEdit: () => void;
	}

	let { event, onEdit }: Props = $props();

	let user = $derived(event.conferenceUser);
	let orgName = $derived(user?.conferenceMember?.representation?.name);
</script>

<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
	<i
		aria-hidden="true"
		class="ph-fill {event.present ? 'ph-sign-in text-success' : 'ph-sign-out text-warning'} text-lg"
	></i>
	<span class="font-medium">
		{user?.name ?? user?.userEmail ?? m.unknown()}
	</span>
	{#if orgName}
		<span class="text-base-content/60 text-sm">{orgName}</span>
	{/if}
	<span class="text-base-content/70">
		{event.committee?.abbreviation ?? event.committee?.name ?? '?'}
	</span>
	{#if event.note}
		<span class="badge badge-outline badge-sm">{event.note}</span>
	{/if}
	<span class="ml-auto text-sm">{new Date(event.timestamp).toLocaleString()}</span>
	<button class="btn btn-ghost btn-sm" onclick={onEdit} aria-label={m.edit()}>
		<i aria-hidden="true" class="ph-fill ph-pen"></i>
	</button>
</li>
