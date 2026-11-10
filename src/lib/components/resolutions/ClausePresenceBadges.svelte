<script lang="ts">
	import type { PresenceAdapter } from '@deutschemodelunitednations/munify-resolution-editor';
	import type { RemotePresence } from '#lib/api/yjs/createPaperYjs.svelte';
	import type { ResolutionViewer } from './paperContext';
	import { isTeam } from './paperContext';
	import { m } from '#lib/paraglide/messages';
	import { presenceIdentity, toFlagEmoji } from './presenceDisplay';
	import { scale } from 'svelte/transition';

	interface Props {
		clauseId: string;
		presence: PresenceAdapter;
		remotePresences: RemotePresence[];
		viewer: ResolutionViewer;
	}

	let { clauseId, presence, remotePresences, viewer }: Props = $props();

	const editors = $derived(presence.editorsFor(clauseId));

	const editorsWithMeta = $derived(
		editors.map((info) => ({
			...info,
			userMeta: remotePresences.find((r) => r.user.id === info.user.id)?.userMeta
		}))
	);

	const AVATAR_ICONS = { person: 'user', participant: 'globe-hemisphere-east', team: 'shield' };

	function getAvatar(info: (typeof editorsWithMeta)[number]): {
		emoji: string | null;
		icon: string;
		label: string;
	} {
		const identity = presenceIdentity({ presence: info, viewerIsTeam: isTeam(viewer) });
		return {
			emoji: identity.kind === 'participant' ? toFlagEmoji(identity.meta.alpha2Code) : null,
			icon: AVATAR_ICONS[identity.kind],
			label: identity.kind === 'team' ? m.roleTeam() : identity.name
		};
	}
</script>

{#if editorsWithMeta.length > 0}
	<div class="flex items-center -space-x-2" role="group" aria-label="Co-editors">
		{#each editorsWithMeta as info (info.user.id)}
			{@const avatar = getAvatar(info)}
			<div
				class="tooltip tooltip-bottom relative z-10 transition-transform hover:z-20 hover:-translate-y-0.5"
				data-tip={avatar.label}
				in:scale={{ duration: 200, start: 0.4 }}
				out:scale={{ duration: 150, start: 0.4 }}
			>
				<div
					class="bg-base-200 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-base-100"
					style="font-size: 0.85rem; line-height: 1;"
				>
					{#if avatar.emoji}
						{avatar.emoji}
					{:else}
						<i
							aria-hidden="true"
							class="ph-fill ph-{avatar.icon} text-base-content/50"
							style="font-size: 0.5rem"
						></i>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
