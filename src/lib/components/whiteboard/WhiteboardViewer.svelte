<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import { extensions } from './whiteboardEditorConfig';

	interface Props {
		data?: string | null;
	}

	let { data }: Props = $props();

	$effect(() => {
		editor = createEditor({
			extensions,
			content: data,
			editable: false
		});
	});

	let editor = $state<Readable<Editor>>();
</script>

{#if $editor}
	<EditorContent editor={$editor} class="prose" />
{/if}
