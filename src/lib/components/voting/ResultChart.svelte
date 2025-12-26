<script lang="ts">
  interface Props {
    votesPro?: number | null;
    votesCon?: number | null;
    votesAbstain?: number | null;
    total?: number | null;
    majorityAmount?: number | null;
    showNumbers?: boolean;
  }

  const {
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
</script>

<div class="card relative h-26 w-full flex-row overflow-hidden bg-base-300 shadow-sm">
  <div
    class="h-full bg-success transition-all duration-300 w-[{getPercentage(
      votesPro
    )}] flex items-start justify-start"
    style="width: {getPercentage(votesPro)}"
  >
    {#if showNumbers && votesPro !== 0 && votesPro != null}
      <span class="badge translate-2 border-1 border-base-100 shadow-sm badge-success"
        >{votesPro ?? 0}</span
      >
    {/if}
  </div>
  <div
    class="-z-10 h-full bg-base-300 transition-all duration-300"
    style="width: {getPercentage(
      (total ?? 0) - (votesPro ?? 0) - (votesCon ?? 0) - (votesAbstain ?? 0)
    )}"
  ></div>
  <div
    class="flex h-full items-end justify-end border-x-1 border-base-200 bg-info transition-all duration-300"
    style="width: {getPercentage(votesAbstain)}"
  >
    {#if showNumbers && votesAbstain != null && votesAbstain !== 0}
      <span class="badge -translate-2 border-1 border-base-100 shadow-sm badge-info"
        >{votesAbstain ?? 0}</span
      >
    {/if}
  </div>
  <div
    class="flex h-full items-center justify-end bg-error transition-all duration-300"
    style="width: {getPercentage(votesCon)}"
  >
    {#if showNumbers && votesCon != null && votesCon !== 0}
      <span class="badge -translate-x-2 border-1 border-base-100 shadow-sm badge-error"
        >{votesCon ?? 0}</span
      >
    {/if}
  </div>

  <div
    class="absolute h-full w-2 -translate-x-1/2 bg-neutral"
    style="left: {getMajorityPercent()};"
  ></div>
  <div
    class="absolute top-2 badge -translate-x-1/2 badge-neutral"
    style="left: {getMajorityPercent()};"
  >
    {majorityAmount ? majorityAmount : '—'}
  </div>
</div>
