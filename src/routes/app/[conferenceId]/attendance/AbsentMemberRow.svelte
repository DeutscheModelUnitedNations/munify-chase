<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import type { absentDelegatesByCommittee } from './attendance';

	interface Props {
		member: ReturnType<typeof absentDelegatesByCommittee>[number]['absent'][number];
	}

	let { member }: Props = $props();
</script>

<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
	{#if member.icon}
		<Flag size="xs" representation={{ type: 'NSA', icon: member.icon }} />
	{:else if member.alpha3Code}
		<Flag size="xs" representation={{ type: 'DELEGATION', alpha3Code: member.alpha3Code }} />
	{:else}
		<i aria-hidden="true" class="ph-fill ph-user text-lg"></i>
	{/if}
	<span class="flex-1">{member.name}</span>
</li>
