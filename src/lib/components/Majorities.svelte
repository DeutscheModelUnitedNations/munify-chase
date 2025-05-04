<script lang="ts">
	import {
		getPaperSupportThreshold,
		getSimpleMajority,
		getTwoThirdsMajority
	} from '$lib/utils/majorities';
	import BasicCard from './BasicCard.svelte';

	interface Props {
		totalPresent: number;
		customSimpleMajority?: number | null;
		customTwoThirdsMajority?: number | null;
		customPaperSupportThreshold?: number | null;
	}

	let {
		totalPresent,
		customSimpleMajority,
		customTwoThirdsMajority,
		customPaperSupportThreshold
	}: Props = $props();
</script>

{#snippet Card(cardData: { number: number | null | undefined; text?: string; faIcon?: string })}
	{@const { number, text, faIcon } = cardData}
	<div class="card bg-base-200 flex-1 flex-col items-center justify-center p-4 shadow-sm">
		<div class="h-7 text-lg">
			{#if text}
				<p class="whitespace-nowrap">{@html text}</p>
			{:else if faIcon}
				<i class="fa-duotone fa-{faIcon.replace('fa-', '')}"></i>
			{/if}
		</div>
		<h4 class="font-mono text-3xl font-bold">{number ?? '?'}</h4>
	</div>
{/snippet}

<BasicCard>
	<div class="flex gap-2">
		{@render Card({ number: totalPresent, faIcon: 'fa-users' })}
		{@render Card({
			number: customSimpleMajority ?? getSimpleMajority(totalPresent),
			text: '50%&thinsp;+&thinsp;1'
		})}
		{@render Card({
			number:
				(customTwoThirdsMajority ??
				getTwoThirdsMajority(totalPresent) >= (customSimpleMajority ?? 0))
					? getTwoThirdsMajority(totalPresent)
					: customSimpleMajority,
			text: '2/3'
		})}
		{@render Card({
			number: customPaperSupportThreshold ?? getPaperSupportThreshold(totalPresent),
			faIcon: 'fa-file-lines'
		})}
	</div>
</BasicCard>
