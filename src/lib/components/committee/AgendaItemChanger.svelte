<script lang="ts">
  import toast from 'svelte-french-toast';
  import { m } from '$lib/paraglide/messages';
  import { promiseToastStrings } from '$lib/utils/toast';
  import { client } from '$lib/api/rumbleClient/client';
  import type { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';

  interface Props {
    committeeId: string;
    activeAgendaItem?: Awaited<ReturnType<typeof committeeTeamQuery>>['activeAgendaItem'];
    agendaItems?: Awaited<ReturnType<typeof committeeTeamQuery>>['agendaItems'];
  }

  const { committeeId, activeAgendaItem, agendaItems }: Props = $props();

  let value = $state(activeAgendaItem?.id ?? '');

  const update = async () => {
    if (value === activeAgendaItem?.id) {
      return;
    }
    await toast.promise(
      client.mutate.updateCommittee({
        __args: {
          id: committeeId,
          activeAgendaItemId: value
        },
        id: true,
        activeAgendaItem: {
          id: true,
          title: true
        }
      }),
      promiseToastStrings(m.agendaItem(), 'update')
    );
  };

  const addAgendaItem = async () => {
    const title = prompt(m.agendaItemTitle());
    if (!title) return;

    await toast.promise(
      client.mutate.createAgendaItem({
        __args: {
          committeeId,
          title
        },
        id: true,
        title: true
      }),
      promiseToastStrings(m.agendaItem(), 'create')
    );
  };
</script>

<div class="join">
  <select class="select join-item w-full select-lg" onchange={update} bind:value>
    <option disabled selected={!activeAgendaItem}>
      {m.selectAgendaItem()}
    </option>
    {#each agendaItems ?? [] as item}
      <option value={item.id} selected={value === item.id}>
        {item.title}
      </option>
    {/each}
  </select>
  <button class="btn join-item btn-lg" onclick={addAgendaItem} aria-label={m.addAgendaItem()}>
    <i class="fas fa-plus"></i>
  </button>
</div>
