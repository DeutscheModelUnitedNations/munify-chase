<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	interface Props {
		totalPresent: number | null;
		simpleMajority: number | null;
		twoThirdsMajority: number | null;
		minAmendmentSponsors?: number | null;
	}

	let {
		totalPresent,
		simpleMajority,
		twoThirdsMajority,
		minAmendmentSponsors = null
	}: Props = $props();
</script>

{#snippet Card(cardData: {
	number: number | null | undefined;
	text?: string;
	faIcon?: string;
	showZero?: boolean;
	tooltip?: string;
})}
	{@const { number, text, faIcon, showZero = false, tooltip } = cardData}
	<div
		class="card bg-base-200 h-full flex-1 flex-col items-center justify-center p-4 shadow-sm tooltip tooltip-bottom"
		data-tip={tooltip}
	>
		<div class="h-7 text-lg">
			{#if text}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- card text is internal formatted content -->
				<p class="whitespace-nowrap">{@html text}</p>
			{:else if faIcon}
				<i class="fa-duotone fa-{faIcon.replace('fa-', '')}"></i>
			{/if}
		</div>
		<h4 class="font-mono text-3xl font-bold">
			{(!totalPresent || totalPresent === 0) && !showZero ? '—' : number}
		</h4>
	</div>
{/snippet}

<div class="flex h-full gap-2">
	{@render Card({
		number: totalPresent ?? 0,
		faIcon: 'fa-flag',
		showZero: true,
		tooltip: m.totalCountriesPresent()
	})}
	{@render Card({
		number: simpleMajority ?? 0,
		faIcon: 'fa-circle-half-stroke',
		tooltip: m.simpleMajorityTooltip()
	})}
	{@render Card({
		number: twoThirdsMajority ?? 0,
		faIcon: 'fa-circle-chevron-up',
		tooltip: m.twoThirdsMajorityTooltip()
	})}
	{#if minAmendmentSponsors !== null}
		{@render Card({
			number: minAmendmentSponsors ?? 0,
			faIcon: 'fa-file-plus',
			tooltip: m.paperSupportThresholdTooltip()
		})}
	{/if}
</div>
