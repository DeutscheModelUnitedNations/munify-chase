<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { BubbleMenu, createEditor, Editor, EditorContent, FloatingMenu } from 'svelte-tiptap';
	import { Placeholder } from '@tiptap/extension-placeholder';
	import WhiteboardBubbleMenu from './WhiteboardBubbleMenu.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import WhiteboardStaticMenu from './WhiteboardStaticMenu.svelte';
	import { extensions } from './whiteboardEditorConfig';
	import { m } from '$lib/paraglide/messages';
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
	<BubbleMenu editor={$editor}>
		<WhiteboardBubbleMenu editor={$editor} />
	</BubbleMenu>
{/if}
