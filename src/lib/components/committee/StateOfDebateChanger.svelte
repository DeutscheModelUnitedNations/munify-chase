<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import TemplateCombobox from './TemplateCombobox.svelte';
	import ChangerActions from './ChangerActions.svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import stateOfDebateTemplates from '#lib/data/stateOfDebateTemplates';
	import { promiseToastStrings } from '#lib/utils/toast';

	interface Props {
		committeeId: string;
		oldStateOfDebate?: string | null;
		abort?: () => void;
	}

	let { committeeId, oldStateOfDebate, abort }: Props = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived -- writable and reactive to prop changes
	let value = $state('');
	$effect(() => {
		value = oldStateOfDebate ?? '';
	});

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
	<TemplateCombobox
		bind:value
		templates={stateOfDebateTemplates}
		placeholder={m.stateOfDebate()}
		icon="file-text"
	/>
	<ChangerActions {abort} onsubmit={submitState} submitLabel={m.submitStateOfDebate()} />
</div>
