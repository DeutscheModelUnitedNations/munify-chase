<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { BubbleMenu, createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { Placeholder } from '@tiptap/extensions';
	import WhiteboardBubbleMenu from './WhiteboardBubbleMenu.svelte';
	import WhiteboardStaticMenu from './WhiteboardStaticMenu.svelte';
	import { extensions } from './whiteboardEditorConfig';
	import { m } from '#lib/paraglide/messages';
	import { onMount } from 'svelte';

	interface Props {
		whiteboardContent?: string | null;
	}

	let { whiteboardContent = $bindable() }: Props = $props();

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
	<WhiteboardStaticMenu editor={$editor} />
	<EditorContent editor={$editor} class="prose leading-7" />
	<!-- Positioned inside the editor since Tiptap 3, so it must stack above the sticky toolbar -->
	<BubbleMenu editor={$editor} class="z-20">
		<WhiteboardBubbleMenu editor={$editor} />
	</BubbleMenu>
{/if}
