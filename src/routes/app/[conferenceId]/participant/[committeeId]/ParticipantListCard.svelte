<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import CurrentSpeaker from '#lib/components/speakersList/CurrentSpeaker.svelte';
	import PresentationSpeakersQueue from '#lib/components/speakersList/PresentationSpeakersQueue.svelte';
	import { positionAnnouncement, positionText, type SelfAddState } from './participantCommittee';

	interface Props {
		list: NonNullable<ComponentProps<typeof CurrentSpeaker>['speakersList']>;
		label: string;
		myPosition: number | null;
		/** What the caller can do about the list, nothing shown when they cannot add themselves */
		selfAdd: SelfAddState | null;
		/** Carries the tour's anchors, on the first list */
		tour: boolean;
		onAdd: () => void;
		onRemove: () => void;
	}
	let { list, label, myPosition, selfAdd, tour, onAdd, onRemove }: Props = $props();
</script>

<div class="card bg-base-100 shadow-sm" data-tour={tour ? 'committee.speakers' : undefined}>
	<div class="card-body gap-3 p-4">
		<h2 class="card-title text-lg">{label}</h2>

		<!-- The badge below says it to the eye; this says it aloud whenever it changes -->
		{#if selfAdd}
			<p class="sr-only" aria-live="polite">
				{positionAnnouncement({ label, position: myPosition })}
			</p>
		{/if}

		<CurrentSpeaker speakersList={list} />

		<PresentationSpeakersQueue rawSpeakers={list.speakers} closed={list.isClosed} />

		<!-- Self-add/remove button -->
		{#if selfAdd}
			<div class="flex flex-col" data-tour={tour ? 'committee.self-add' : undefined}>
				{#if selfAdd === 'onList' && myPosition !== null}
					<div class="flex w-full flex-col gap-2">
						<span class="badge {myPosition === 0 ? 'badge-success' : 'badge-primary'} w-full">
							{positionText(myPosition)}
						</span>
						<button class="btn btn-outline btn-error btn-sm w-full" onclick={onRemove}>
							<i aria-hidden="true" class="ph-fill ph-minus mr-1"></i>
							{m.removeFromList()}
						</button>
					</div>
				{:else if selfAdd === 'closed'}
					<div class="text-sm opacity-50">
						<i aria-hidden="true" class="ph-fill ph-lock mr-1"></i>
						{m.listClosedCannotAdd()}
					</div>
				{:else if selfAdd === 'notPresent'}
					<div class="text-sm opacity-50">
						<i aria-hidden="true" class="ph-fill ph-warning mr-1"></i>
						{m.notPresentCannotAdd()}
					</div>
				{:else}
					<button class="btn btn-primary btn-sm" onclick={onAdd}>
						<i aria-hidden="true" class="ph-fill ph-plus mr-1"></i>
						{m.addMeToList()}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
