<script
	lang="ts"
	generics="T extends { id: string; representation?: ComponentProps<typeof Flag>['representation'] }"
>
	import type { ComponentProps } from 'svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		value: string;
		members: T[];
		filter: (members: T[], search: string) => T[];
		getName: (member: T) => string;
		busy: boolean;
		add: () => void;
	}

	let { value = $bindable(), members, filter, getName, busy, add }: Props = $props();
</script>

<!-- Chairs pick a delegation to add as sponsor, for papers and amendments alike -->
<Combobox
	bind:value
	options={members}
	{filter}
	getStringValue={getName}
	getKey={(member) => member.id}
	placeholder={m.selectMember()}
	submit={add}
	triggerClass="btn btn-neutral btn-square btn-lg join-item"
>
	{#snippet ListItem(option)}
		<Flag size="xs" representation={option.representation} />
		<span class="ml-2 flex-1">{getName(option)}</span>
	{/snippet}
	{#snippet AdditionalButtons()}
		<button
			class="btn btn-neutral btn-lg btn-square join-item"
			aria-label={m.addSponsor()}
			disabled={busy || !value}
			onclick={add}
		>
			<i class="fas fa-plus"></i>
		</button>
	{/snippet}
</Combobox>
