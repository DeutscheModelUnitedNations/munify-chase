<script lang="ts">
	import { graphql, type SpeakersListCategoryEnum$options } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';

	interface Props {
		speakersList;
		type: SpeakersListCategoryEnum$options;
	}

	let { speakersList, type }: Props = $props();

	onMount(() => {
		hotkeys('cmd+n, cmd+shift+n', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'cmd+s':
					if (type === 'SPEAKERS_LIST') {
						console.log('Start /Stop Timer Speakers List');
					}
					break;
				case 'cmd+shift+s':
					if (type === 'COMMENT_LIST') {
						console.log('Start /Stop Timer Comment List');
					}
			}
		});
	});
</script>

<button
	class="btn {type === 'SPEAKERS_LIST' ? 'btn-error' : 'btn-warning'} btn-lg flex flex-1 gap-2"
>
	<i class="fas fa-diagram-next"></i>
	{m.nextSpeaker()}
	<span class="kbd text-base-content">
		{#if type === 'COMMENT_LIST'}
			⌘ ⇧ N
		{:else if type === 'SPEAKERS_LIST'}
			⌘ N
		{/if}
	</span>
</button>
