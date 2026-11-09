<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '#lib/paraglide/messages';
	import { isDockItemActive } from './chairAlerts';

	interface Props {
		items: { key: string; icon: string; label: () => string; href: string }[];
		conferenceId: string;
		committeeId: string;
		/** Adds an entry for the draft resolution being debated */
		activeDraftResolutionId: string | null | undefined;
		/** Pending requests, marked on the requests entry */
		pendingRequests: number;
	}
	let { items, conferenceId, committeeId, activeDraftResolutionId, pendingRequests }: Props =
		$props();
</script>

<!-- Bottom dock -->
<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
	{#each items as item, i (item.key)}
		<a
			href={item.href}
			class="group relative"
			class:dock-active={isDockItemActive({
				key: item.key,
				routeId: page.route.id,
				pathname: page.url.pathname,
				activeDraftResolutionId
			})}
		>
			<span class="relative inline-flex">
				<!-- fallow-ignore-next-line css-token-drift -- daisyUI's dock icon size, relative to the label -->
				<i aria-hidden="true" class="ph-duotone ph-{item.icon} size-[1.2em]"></i>
				{#if item.key === 'requests' && pendingRequests > 0}
					<span class="absolute -top-1 -right-1 flex size-2.5">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"
						></span>
						<span class="relative inline-flex size-2.5 rounded-full bg-error"></span>
					</span>
				{/if}
			</span>
			<span class="dock-label">{item.label()}</span>
			<kbd
				class="kbd kbd-sm absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-base-100/80 px-2 py-1 z-10"
				>⌥{i + 1}</kbd
			>
		</a>
	{/each}
	{#if activeDraftResolutionId}
		<a
			href={resolve('/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]', {
				conferenceId,
				committeeId,
				paperId: activeDraftResolutionId
			})}
			class="group relative"
			class:dock-active={page.url.pathname.includes(activeDraftResolutionId)}
		>
			<i aria-hidden="true" class="ph-duotone ph-note-pencil size-[1.2em]"></i>
			<span class="dock-label">{m.activeDraftResolution()}</span>
		</a>
	{/if}
</div>
