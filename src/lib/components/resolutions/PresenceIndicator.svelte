<script lang="ts">
	import type { RemotePresence } from '$lib/api/yjs/createPaperYjs.svelte';
	import type { ResolutionViewer } from './paperContext';
	import { isTeam } from './paperContext';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		remotePresences: RemotePresence[];
		viewer: ResolutionViewer;
	}

	let { remotePresences, viewer }: Props = $props();

	function getDisplay(presence: RemotePresence): {
		name: string;
		representation: { alpha2Code?: string | null; alpha3Code?: string | null; name?: string | null; type: string } | null;
	} {
		const meta = presence.userMeta;

		if (!meta) {
			return { name: presence.user.name || '?', representation: null };
		}

		const isParticipant =
			meta.conferenceUserType === 'DELEGATE' || meta.conferenceUserType === 'NON_STATE_ACTOR';

		if (isParticipant) {
			const name =
				(meta.alpha3Code ? getTranslatedCountryNameFromAlpha3Code(meta.alpha3Code) : null) ??
				meta.nationName ??
				'?';
			const representation =
				meta.alpha2Code || meta.alpha3Code
					? { alpha2Code: meta.alpha2Code, alpha3Code: meta.alpha3Code, name: meta.nationName, type: 'DELEGATION' }
					: null;
			return { name, representation };
		}

		if (isTeam(viewer)) {
			return { name: presence.user.name || '?', representation: null };
		}

		return { name: m.roleTeam(), representation: null };
	}

	// De-duplicate by user id (same user in multiple tabs appears once).
	const unique = $derived(
		remotePresences.filter(
			(p, i, arr) => arr.findIndex((q) => q.user.id === p.user.id) === i
		)
	);
</script>

<ul class="space-y-2">
	{#each unique as presence (presence.user.id)}
		{@const display = getDisplay(presence)}
		<li class="flex items-center gap-3">
			{#if display.representation}
				<Flag size="xs" representation={display.representation} />
			{:else}
				<div class="bg-base-200 flex h-6 w-8 items-center justify-center rounded">
					<i class="fas fa-user text-xs opacity-60"></i>
				</div>
			{/if}
			<span class="font-medium">{display.name}</span>
		</li>
	{/each}
</ul>
