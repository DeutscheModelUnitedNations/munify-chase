<script lang="ts">
interface Props {
  totalPresent: number | null;
  simpleMajority: number | null;
  twoThirdsMajority: number | null;
  paperSupportThreshold: number | null;
}

const {
  totalPresent,
  simpleMajority,
  twoThirdsMajority,
  paperSupportThreshold,
}: Props = $props();
</script>

{#snippet Card(cardData: {
	number: number | null | undefined;
	text?: string;
	faIcon?: string;
	showZero?: boolean;
})}
	{@const { number, text, faIcon, showZero = false } = cardData}
	<div class="card bg-base-200 h-full flex-1 flex-col items-center justify-center p-4 shadow-sm">
		<div class="h-7 text-lg">
			{#if text}
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
	{@render Card({ number: totalPresent ?? 0, faIcon: 'fa-users', showZero: true })}
	{@render Card({
		number: simpleMajority ?? 0,
		text: '50%&thinsp;+&thinsp;1'
	})}
	{@render Card({
		number: twoThirdsMajority ?? 0,
		text: '2/3'
	})}
	{@render Card({
		number: paperSupportThreshold ?? 0,
		faIcon: 'fa-file-lines'
	})}
</div>
