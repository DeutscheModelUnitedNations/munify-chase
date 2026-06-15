<script lang="ts">
	import { ResolutionEditor } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';
	import { onDestroy } from 'svelte';
	import SyncBadge from './SyncBadge.svelte';
	import type { PresenceUser } from '@deutschemodelunitednations/munify-resolution-editor';

	interface Props {
		paperId: string;
		user: PresenceUser;
		editable?: boolean;
	}

	let { paperId, user, editable = true }: Props = $props();

	// One client per mount; recreated if paperId changes.
	let client: PaperYjsClient | null = $state(null);

	$effect(() => {
		const current = createPaperYjsClient({ paperId, user });
		client = current;
		return () => {
			void current.destroy();
		};
	});

	onDestroy(() => {
		void client?.destroy();
	});
</script>

{#if client}
	<div class="relative flex h-full w-full flex-col">
		<div class="pointer-events-none absolute top-2 right-2 z-10">
			<div class="pointer-events-auto">
				<SyncBadge
					connectionState={client.connectionState}
					persistenceLoaded={client.persistenceLoaded}
					wsSynced={client.wsSynced}
				/>
			</div>
		</div>
		<ResolutionEditor
			store={client.store}
			presence={client.presence}
			labels={englishLabels}
			preamblePhrases={englishPreamblePhrases}
			operativePhrases={englishOperativePhrases}
			{editable}
		/>
	</div>
{/if}
