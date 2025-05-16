<script lang="ts">
	interface Props {
		votesPro: number | null;
		votesCon: number | null;
		votesAbstain: number | null;
		total?: number | null;
		majorityAmount?: number | null;
	}

	let { votesPro, votesCon, votesAbstain, total, majorityAmount }: Props = $props();

	const getPercentage = (value: number | null) => {
		if (value === null || total === 0) return 0;
		return `${(value / (total ?? 1)) * 100}%`;
	};

	const getMajorityPercent = () => {
		return `${((majorityAmount ?? 0) / (total || 1)) * 100}%`;
	};
</script>

<div class="bg-base-300 card relative h-20 w-full flex-row overflow-hidden shadow-sm">
	<div
		class="bg-success h-full transition-all duration-300 w-[{getPercentage(votesPro)}]"
		style="width: {getPercentage(votesPro)}"
	></div>
	<div
		class="bg-base-300 h-full transition-all duration-300"
		style="width: {getPercentage(
			(total ?? 0) - (votesPro ?? 0) - (votesCon ?? 0) - (votesAbstain ?? 0)
		)}"
	></div>
	<div
		class="bg-info border-base-200 h-full border-x-1 transition-all duration-300"
		style="width: {getPercentage(votesAbstain)}"
	></div>
	<div
		class="bg-error h-full transition-all duration-300"
		style="width: {getPercentage(votesCon)}"
	></div>

	<div
		class="bg-neutral absolute h-full w-2 -translate-x-1/2"
		style="left: {getMajorityPercent()};"
	></div>
	<div
		class="badge badge-neutral absolute top-2 -translate-x-1/2"
		style="left: {getMajorityPercent()};"
	>
		{majorityAmount ? majorityAmount : '—'}
	</div>
</div>
