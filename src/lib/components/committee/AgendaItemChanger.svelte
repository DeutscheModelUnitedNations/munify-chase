<script lang="ts">
import toast from "svelte-french-toast";
import { invalidateAll } from "$app/navigation";
import { type CommitteeTeamQuery$result, cache, graphql } from "$houdini";
import { m } from "$lib/paraglide/messages";
import { promiseToastStrings } from "$lib/utils/toast";

interface Props {
  committeeId: string;
  activeAgendaItem?: CommitteeTeamQuery$result["findFirstCommittee"]["activeAgendaItem"];
  agendaItems?: CommitteeTeamQuery$result["findFirstCommittee"]["agendaItems"];
}

const { committeeId, activeAgendaItem, agendaItems }: Props = $props();

const value = $state(activeAgendaItem?.id ?? "");

const UpdateActiveAgendaItemMutation = graphql(`
		mutation UpdateActiveAgendaItem($agendaItemId: ID!, $committeeId: ID!) {
			updateCommittee(id: $committeeId, activeAgendaItemId: $agendaItemId) {
				id
				activeAgendaItem {
					id
					title
				}
			}
		}
	`);

const AddAgendaItemMutation = graphql(`
		mutation AddAgendaItem($committeeId: ID!, $title: String!) {
			createAgendaItem(committeeId: $committeeId, title: $title) {
				id
				title
			}
		}
	`);

const update = async () => {
  if (value === activeAgendaItem?.id) {
    return;
  }
  await toast.promise(
    UpdateActiveAgendaItemMutation.mutate({
      agendaItemId: value,
      committeeId,
    }),
    promiseToastStrings(m.agendaItem(), "update"),
  );
};

const addAgendaItem = async () => {
  const title = prompt(m.agendaItemTitle());
  if (!title) return;

  await toast.promise(
    AddAgendaItemMutation.mutate({
      committeeId,
      title,
    }),
    promiseToastStrings(m.agendaItem(), "create"),
  );

  cache.markStale();
  invalidateAll();
};
</script>

<div class="join">
	<select class="select select-lg join-item w-full" onchange={update} bind:value>
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
