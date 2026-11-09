<script
	lang="ts"
	generics="M extends { id: string; representation?: ComponentProps<typeof Flag>['representation'] }"
>
	import type { ComponentProps } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import Combobox from '#lib/components/Combobox.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import { createMemberFilter, representationName } from './sponsors';

	interface Props {
		/** The picked delegation's name. */
		value: string;
		members: M[];
		selected: M | null;
	}

	let { value = $bindable(), members, selected }: Props = $props();

	const getName = (member: M) => representationName(member.representation);
	const filterMembers = createMemberFilter<M>({ getName });
</script>

<!-- The chair proposes an amendment on behalf of a delegation -->
<div class="flex flex-col gap-1">
	<span class="label-text text-sm font-medium">{m.selectProposerDelegation()}</span>
	{#if selected}
		<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
			<Flag representation={selected.representation} size="xs" />
			<span class="flex-1 text-sm font-medium">{getName(selected)}</span>
			<button
				class="btn btn-ghost btn-xs btn-circle"
				aria-label={m.deselect()}
				onclick={() => (value = '')}
			>
				<i aria-hidden="true" class="ph-fill ph-x text-xs"></i>
			</button>
		</div>
	{:else}
		<Combobox
			bind:value
			options={members}
			filter={filterMembers}
			getStringValue={getName}
			getKey={(mem) => mem.id}
			placeholder={m.selectMember()}
			triggerClass="input-lg join-item flex items-center justify-center px-3 text-base-content/40 hover:text-base-content transition-colors"
		>
			{#snippet ListItem(option)}
				<Flag size="xs" representation={option.representation} />
				<span class="ml-2 flex-1">{getName(option)}</span>
			{/snippet}
		</Combobox>
	{/if}
</div>
