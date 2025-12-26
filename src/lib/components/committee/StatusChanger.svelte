<script lang="ts">
  import dayjs from 'dayjs';
  import toast from 'svelte-french-toast';
  import { client, type CommitteestatusEnum } from '$lib/api/rumbleClient/client';
  import Tabs from '$lib/components/Tabs.svelte';
  import { m } from '$lib/paraglide/messages';
  import { serverTime } from '$lib/state/serverTime.svelte';
  import { promiseToastStrings } from '$lib/utils/toast';

  type Props = {
    committeeId: string;
    oldStatus?: CommitteestatusEnum;
    oldUntil?: Date;
    oldCustomName?: string;
    abort?: () => void;
  };
  const { committeeId, oldStatus, oldUntil, oldCustomName = '', abort }: Props = $props();

  const categories: {
    id: CommitteestatusEnum;
    faIcon: string;
  }[] = [
    { id: 'FORMAL', faIcon: 'podium' },
    { id: 'INFORMAL', faIcon: 'comments' },
    { id: 'PAUSE', faIcon: 'mug-saucer' },
    { id: 'SUSPENSION', faIcon: 'forward-step' }
  ];

  const absoluteTimes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const relativeTimes = [3, 5, 10, 15, 20, 25, 30];

  let activeCategory: CommitteestatusEnum = $state('INFORMAL');
  let until = $state(dayjs(oldUntil) ?? serverTime.value);
  const untilFormatted = $derived(dayjs(until).format('HH:mm:ss'));
  let customName = $state(oldCustomName);

  let customNameOpen = $state(false);

  const submitStatus = async () => {
    if (until.isBefore(serverTime.value)) {
      toast.error(m.dateCannotBeInPast());
    }
    await toast.promise(
      client.mutate.updateCommittee({
        __args: {
          status: activeCategory,
          statusUntil: until.toDate(),
          statusHeadline: customName,
          id: committeeId
        },
        id: true,
        status: true,
        statusUntil: true,
        statusHeadline: true
      }),
      promiseToastStrings(m.committeeStatus(), 'update')
    );
  };

  $effect(() => {
    if (customName) {
      customNameOpen = true;
    }
  });

  $effect(() => {
    if (oldStatus) {
      switch (oldStatus) {
        case 'FORMAL':
          activeCategory = 'INFORMAL';
          break;
        default:
          activeCategory = 'FORMAL';
          break;
      }
    }
  });
</script>

<div class="flex flex-col gap-4">
  <Tabs tabs={categories} bind:activeTab={activeCategory} />
  <div class="card flex flex-row items-center gap-2 bg-base-200 p-2">
    <i class="fa-duotone fa-clock w-8 text-center text-2xl"></i>
    <div
      class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-12"
    >
      {#each absoluteTimes as time, index (index)}
        <button
          class="btn flex-1 bg-base-100"
          onclick={() =>
            (until = serverTime.value.minute(time).second(0).isBefore(serverTime.value)
              ? serverTime.value.add(1, 'hour').minute(time).second(0)
              : serverTime.value.minute(time).second(0))}
        >
          {time}
        </button>
      {/each}
    </div>
  </div>
  <div class="card flex flex-row items-center gap-2 bg-base-200 p-2">
    <i class="fa-duotone fa-timer w-8 text-center text-2xl"></i>
    <div class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-7">
      {#each relativeTimes as time, index (index)}
        <button
          class="btn flex-1 bg-base-100"
          onclick={() => (until = serverTime.value.add(time, 'minute'))}
        >
          {time}
        </button>
      {/each}
    </div>
  </div>
  <div class="flex w-full gap-2">
    <input
      type="time"
      class="input input-xl w-full flex-1 text-center font-mono"
      value={untilFormatted}
      onchange={(e) => {
        const inputValue = (e.target as HTMLInputElement).value;
        const parts = inputValue.split(':');
        until = serverTime.value
          .hour(parseInt(parts[0], 10))
          .minute(parseInt(parts[1], 10))
          .second(parseInt(parts[2], 10));
      }}
      step="1"
    />
    <button
      class="btn btn-square btn-xl"
      aria-label="Decrease time"
      onclick={() => (until = dayjs(until).subtract(1, 'minute'))}
    >
      <i class="fa-solid fa-minus"></i>
    </button>
    <button
      class="btn btn-square btn-xl"
      onclick={() => (until = dayjs(until).add(1, 'minute'))}
      aria-label="Increase time"
    >
      <i class="fa-solid fa-plus"></i>
    </button>
    <button
      class="btn btn-square btn-xl {customNameOpen ? 'btn-primary' : ''}"
      onclick={() => {
        if (customNameOpen) {
          customNameOpen = false;
          customName = '';
        } else {
          customNameOpen = true;
        }
      }}
      aria-label="Increase time"
    >
      <i class="fa-solid fa-tag"></i>
    </button>
  </div>
  {#if customNameOpen}
    <input
      type="text"
      class="input w-full flex-1 py-2 text-center"
      bind:value={customName}
      placeholder={m.customName()}
    />
  {/if}
  <div class="flex w-full gap-2">
    {#if abort}
      <button
        class="btn btn-lg btn-error"
        onclick={() => {
          abort();
        }}
      >
        <i class="fas fa-xmark mr-2"></i>
        {m.abort()}
      </button>
    {/if}
    <button
      class="btn w-full flex-1 btn-lg btn-primary {until.isBefore(serverTime.value)
        ? 'btn-disabled'
        : ''}"
      onclick={() => {
        submitStatus();
        if (abort) {
          abort();
        }
      }}
    >
      <i class="fas fa-save mr-2"></i>
      {m.submitStatus()}
    </button>
  </div>
</div>
