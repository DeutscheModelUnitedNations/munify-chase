<script lang="ts">
	import type { RemotePresence } from '#lib/api/yjs/createPaperYjs.svelte';
	import type { ResolutionViewer } from './paperContext';
	import { isTeam } from './paperContext';
	import { presenceIdentity, uniqueByUser, type PresenceIdentity } from './presenceDisplay';
	import Flag from '#lib/components/Flag.svelte';
	import { m } from '#lib/paraglide/messages';

	interface Props {
		remotePresences: RemotePresence[];
		viewer: ResolutionViewer;
	}

	let { remotePresences, viewer }: Props = $props();

	function flagOf(identity: PresenceIdentity) {
		if (identity.kind !== 'participant') return null;
		const { alpha2Code, alpha3Code, nationName } = identity.meta;
		if (!alpha2Code && !alpha3Code) return null;
		return { alpha2Code, alpha3Code, name: nationName, type: 'DELEGATION' };
	}

	function getDisplay(presence: RemotePresence) {
		const identity = presenceIdentity({ presence, viewerIsTeam: isTeam(viewer) });
		const name = identity.kind === 'team' ? m.roleTeam() : identity.name;
		return { name, representation: flagOf(identity) };
	}

	const unique = $derived(uniqueByUser(remotePresences));
</script>

<ul class="space-y-2">
	{#each unique as presence (presence.user.id)}
		{@const display = getDisplay(presence)}
		<li class="flex items-center gap-3">
			{#if display.representation}
				<Flag size="xs" representation={display.representation} />
			{:else}
				<div class="bg-base-200 flex h-6 w-8 items-center justify-center rounded">
					<i aria-hidden="true" class="ph-fill ph-user text-xs opacity-60"></i>
				</div>
			{/if}
			<span class="font-medium">{display.name}</span>
		</li>
	{/each}
</ul>
