<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
		activeAgendaItem?: { id: string; title: string } | null;
		agendaItems?: { id: string; title: string }[];
	}

	let { committeeId, activeAgendaItem, agendaItems }: Props = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived -- writable and reactive to prop changes
	let value = $state('');
	$effect(() => {
		value = activeAgendaItem?.id ?? '';
	});

	const update = async () => {
		if (value === activeAgendaItem?.id) {
			return;
		}
		await toast.promise(
			client.mutate.updateCommittee({
				__args: { id: committeeId, activeAgendaItemId: value },
				id: true,
				activeAgendaItemId: true,
				activeAgendaItem: {
					title: true,
					id: true
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
					id: nanoid(),
					speakersListId: nanoid(),
					commentListId: nanoid(),
					committeeId,
					title
				},
				id: true,
				title: true,
				speakersList: {
					id: true,
					agendaItemId: true,
					type: true,
					speakingTime: true,
					timeLeft: true,
					isClosed: true,
					phase: true,
					startTimestamp: true
				}
			}),
			promiseToastStrings(m.agendaItem(), 'create')
		);
	};
</script>

<div class="join">
	<select class="select select-lg join-item w-full" onchange={update} bind:value>
		<option disabled selected={!activeAgendaItem}>
			{m.selectAgendaItem()}
		</option>
		{#each agendaItems ?? [] as item (item.id)}
			<option value={item.id} selected={value === item.id}>
				{item.title}
			</option>
		{/each}
	</select>
	<button class="btn join-item btn-lg" onclick={addAgendaItem} aria-label={m.addAgendaItem()}>
		<i class="fas fa-plus"></i>
	</button>
</div>
