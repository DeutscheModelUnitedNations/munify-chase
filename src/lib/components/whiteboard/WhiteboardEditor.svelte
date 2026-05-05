<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { BubbleMenu, createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { Placeholder } from '@tiptap/extension-placeholder';
	import WhiteboardBubbleMenu from './WhiteboardBubbleMenu.svelte';
	import WhiteboardStaticMenu from './WhiteboardStaticMenu.svelte';
	import { extensions } from './whiteboardEditorConfig';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';

	interface Props {
		whiteboardContent?: string | null;
		committeeID?: string | null;
		conferenceID?: string | null;
	}

	let { whiteboardContent = $bindable(), committeeID, conferenceID }: Props = $props();

	onMount(() => {
		editor = createEditor({
			extensions: [
				Placeholder.configure({
					placeholder: m.whiteboardPlaceholder()
				}),
				...extensions
			],
			content: whiteboardContent,
			autofocus: true,
			onUpdate: ({ editor }) => {
				whiteboardContent = editor.getHTML();
			}
		});
	});

	let editor = $state<Readable<Editor>>();
</script>

{#if editor && $editor}
	<WhiteboardStaticMenu editor={$editor} {committeeID} {conferenceID} />
	<EditorContent editor={$editor} class="prose leading-7" />
	<BubbleMenu editor={$editor}>
		<WhiteboardBubbleMenu editor={$editor} />
	</BubbleMenu>
{/if}
