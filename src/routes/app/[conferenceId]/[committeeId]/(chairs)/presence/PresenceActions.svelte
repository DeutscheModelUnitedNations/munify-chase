<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { promiseToastStrings } from '#lib/utils/toast';
	import toast from 'svelte-french-toast';

	interface Props {
		memberIds: string[];
	}

	let { memberIds }: Props = $props();

	const setAllPresence = (present: boolean) => {
		toast.promise(
			client.mutate.setPresenceForCommitteeMembers({
				__args: { ids: memberIds, present },
				id: true,
				present: true
			}),
			promiseToastStrings(m.presence(), 'update')
		);
	};

	registerCommands(() => [
		{
			id: 'presence.all-present',
			title: m.setAllPresent,
			group: 'page',
			icon: 'door',
			run: () => setAllPresence(true)
		},
		{
			id: 'presence.all-absent',
			title: m.setAllAbsent,
			group: 'page',
			icon: 'door-open',
			run: () => setAllPresence(false)
		}
	]);
</script>

<button class="btn btn-success btn-soft" onclick={() => setAllPresence(true)}>
	<i aria-hidden="true" class="ph-fill ph-door mr-2"></i>
	{m.setAllPresent()}
</button>
<button class="btn btn-error btn-soft" onclick={() => setAllPresence(false)}>
	<i aria-hidden="true" class="ph-fill ph-door-open mr-2"></i>
	{m.setAllAbsent()}
</button>
