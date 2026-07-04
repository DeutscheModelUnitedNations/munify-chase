<script lang="ts">
	import type { PresenceAdapter } from '@deutschemodelunitednations/munify-resolution-editor';
	import type { RemotePresence } from '$lib/api/yjs/createPaperYjs.svelte';
	import type { ResolutionViewer } from './paperContext';
	import { isTeam } from './paperContext';
	import { m } from '$lib/paraglide/messages';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
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

	/** Convert ISO alpha-2 code to a flag emoji (e.g. "DE" → "🇩🇪"). */
	function toFlagEmoji(alpha2: string | null | undefined): string | null {
		if (!alpha2 || alpha2.length !== 2) return null;
		const base = 0x1f1e6 - 0x41;
		const upper = alpha2.toUpperCase();
		return String.fromCodePoint(base + upper.charCodeAt(0), base + upper.charCodeAt(1));
	}

	function getAvatar(info: (typeof editorsWithMeta)[number]): {
		emoji: string | null;
		faIcon: string;
		label: string;
	} {
		const meta = info.userMeta;
		if (!meta) return { emoji: null, faIcon: 'fa-user', label: info.user.name || '?' };

		const isParticipant =
			meta.conferenceUserType === 'DELEGATE' || meta.conferenceUserType === 'NON_STATE_ACTOR';

		if (isParticipant) {
			const label =
				(meta.alpha3Code ? getTranslatedCountryNameFromAlpha3Code(meta.alpha3Code) : null) ??
				meta.nationName ??
				'?';
			return { emoji: toFlagEmoji(meta.alpha2Code), faIcon: 'fa-earth-europe', label };
		}

		if (isTeam(viewer)) {
			return { emoji: null, faIcon: 'fa-user', label: info.user.name || '?' };
		}

		return { emoji: null, faIcon: 'fa-shield', label: m.roleTeam() };
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
						<i class="fas {avatar.faIcon} text-base-content/50" style="font-size: 0.5rem"></i>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}
