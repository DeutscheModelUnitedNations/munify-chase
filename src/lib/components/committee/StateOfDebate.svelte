<script lang="ts">
	import { m, stateOfDebate } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import Combobox from '../Combobox.svelte';
	import { graphql } from '$houdini';
	import stateOfDebateTemplates from '$lib/data/stateOfDebateTemplates';

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

	const UpdateStateOfDebateMutation = graphql(`
		mutation UpdateStateOfDebate($stateOfDebate: String!, $committeeId: ID!) {
			updateCommittee(id: $committeeId, stateOfDebate: $stateOfDebate) {
				id
				stateOfDebate
			}
		}
	`);

	const submitState = async () => {
		await toast.promise(
			UpdateStateOfDebateMutation.mutate({
				stateOfDebate: value,
				committeeId
			}),
			{
				loading: m.updatingStateOfDebate(),
				success: m.updatedStateOfDebate(),
				error: m.errorUpdatingStateOfDebate()
			}
		);
	};
</script>

<div class="flex flex-col gap-4">
	<Combobox bind:value options={presets} side="top" />
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
