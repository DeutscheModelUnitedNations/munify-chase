<script lang="ts">
	import { m, stateOfDebate } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import Combobox from '../Combobox.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import stateOfDebateTemplates from '$lib/data/stateOfDebateTemplates';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Props {
		committeeId: string;
		oldStateOfDebate?: string | null;
		abort?: () => void;
	}

	let { committeeId, oldStateOfDebate, abort }: Props = $props();

	let value = $state(oldStateOfDebate ?? '');

	const presets = stateOfDebateTemplates.map((preset) => ({
		label: preset
	}));

	const submitState = async () => {
		await toast.promise(
			client.mutate.updateCommittee({
				__args: { id: committeeId, stateOfDebate: value },
				id: true,
				stateOfDebate: true
			}),
			promiseToastStrings(m.stateOfDebate(), 'update')
		);
	};
</script>

<div class="flex flex-col gap-4">
	<Combobox
		bind:value
		options={presets}
		side="top"
		placeholder={m.stateOfDebate()}
		getStringValue={({ label }) => label}
		filter={(options, v) =>
			options.filter(({ label }) => label.toLowerCase().includes(v.toLowerCase()))}
	>
		{#snippet ListItem(option)}
			<div class="flex items-center gap-2">
				<i class="fas fa-file-alt"></i>
				<span>{option.label}</span>
			</div>
		{/snippet}

		{#snippet AdditionalButtons()}
			<button
				class="btn btn-square input-lg join-item"
				aria-label="Clear selection"
				onclick={() => (value = '')}
			>
				<i class="fas fa-trash"></i>
			</button>
		{/snippet}
	</Combobox>
	<div class="flex w-full gap-2">
		{#if abort}
			<button
				class="btn btn-error btn-lg"
				onclick={() => {
					abort();
				}}
			>
				<i class="fas fa-xmark mr-2"></i>
				{m.abort()}
			</button>
		{/if}
		<button
			class="btn btn-primary btn-lg w-full flex-1"
			onclick={() => {
				submitState();
				if (abort) {
					abort();
				}
			}}
		>
			<i class="fas fa-save mr-2"></i>
			{m.submitStateOfDebate()}
		</button>
	</div>
</div>
