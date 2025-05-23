<script lang="ts">
	import { graphql, type CommitteeTeamQuery$result } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
		activeAgendaItem?: CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem'];
		agendaItems?: CommitteeTeamQuery$result['findFirstCommittee']['agendaItems'];
	}

	let { committeeId, activeAgendaItem, agendaItems }: Props = $props();

	let value = $state(activeAgendaItem?.id ?? '');

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

	const update = async () => {
		if (value === activeAgendaItem?.id) {
			return;
		}
		await toast.promise(
			UpdateActiveAgendaItemMutation.mutate({
				agendaItemId: value,
				committeeId
			}),
			promiseToastStrings(m.agendaItem(), 'update')
		);
	};
</script>

<select class="select select-lg w-full" onchange={update} bind:value>
	<option disabled selected={!activeAgendaItem}>
		{m.selectAgendaItem()}
	</option>
	{#each agendaItems ?? [] as item}
		<option value={item.id} selected={value === item.id}>
			{item.title}
		</option>
	{/each}
</select>
