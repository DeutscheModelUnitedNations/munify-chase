<script lang="ts">
	interface Props {
		votesPro?: number | null;
		votesCon?: number | null;
		votesAbstain?: number | null;
		total?: number | null;
		majorityAmount?: number | null;
		showNumbers?: boolean;
	}

	let {
		votesPro,
		votesCon,
		votesAbstain,
		total,
		majorityAmount,
		showNumbers = false
	}: Props = $props();

	const getPercentage = (value: number | undefined | null) => {
		if (value === null || value === undefined || total === 0) return 0;
		return `${(value / (total ?? 1)) * 100}%`;
	};

	const getMajorityPercent = () => {
		return `${((majorityAmount ?? 0) / (total || 1)) * 100}%`;
	};

	const proLandsOnMajority = $derived(
		votesPro != null &&
			majorityAmount != null &&
			(total ?? 0) > 0 &&
			majorityAmount > 0 &&
			votesPro === majorityAmount
	);
</script>

<div class="bg-base-300 card relative flex h-26 w-full flex-row overflow-hidden shadow-sm">
	<div
		class="bg-success flex h-full items-start justify-start transition-all duration-300"
		class:relative={proLandsOnMajority}
		class:z-10={proLandsOnMajority}
		style={proLandsOnMajority
			? `width: calc(${getPercentage(votesPro)} + 0.5rem)`
			: `width: ${getPercentage(votesPro)}`}
	>
		{#if showNumbers && votesPro !== 0 && votesPro != null}
			<span class="badge badge-success border-base-100 translate-2 border-1 shadow-sm"
				>{votesPro ?? 0}</span
			>
		{/if}
	</div>
	<div
		class="bg-base-300 -z-10 h-full transition-all duration-300"
		style="width: {getPercentage(
			(total ?? 0) - (votesPro ?? 0) - (votesCon ?? 0) - (votesAbstain ?? 0)
		)}"
	></div>
	<div
		class="bg-info border-base-200 flex h-full items-end justify-end border-x-1 transition-all duration-300"
		style="width: {getPercentage(votesAbstain)}"
	>
		{#if showNumbers && votesAbstain != null && votesAbstain !== 0}
			<span class="badge badge-info border-base-100 -translate-2 border-1 shadow-sm"
				>{votesAbstain ?? 0}</span
			>
		{/if}
	</div>
	<div
		class="bg-error flex h-full items-center justify-end transition-all duration-300"
		style="width: {getPercentage(votesCon)}"
	>
		{#if showNumbers && votesCon != null && votesCon !== 0}
			<span class="badge badge-error border-base-100 -translate-x-2 border-1 shadow-sm"
				>{votesCon ?? 0}</span
			>
		{/if}
	</div>

	<div
		class="bg-neutral absolute h-full w-2 -translate-x-1/2 transition-all duration-500"
		style="left: {getMajorityPercent()};"
	></div>
	<div
		class="badge badge-neutral absolute top-2 -translate-x-1/2 transition-all duration-500"
		style="left: {getMajorityPercent()};"
	>
		{majorityAmount ? majorityAmount : '—'}
	</div>
</div>
