<script lang="ts">
import { Placeholder } from "@tiptap/extension-placeholder";
import { onMount } from "svelte";
import type { Readable } from "svelte/store";
import {
  BubbleMenu,
  createEditor,
  type Editor,
  EditorContent,
} from "svelte-tiptap";
import { m } from "$lib/paraglide/messages";
import WhiteboardBubbleMenu from "./WhiteboardBubbleMenu.svelte";
import WhiteboardStaticMenu from "./WhiteboardStaticMenu.svelte";
import { extensions } from "./whiteboardEditorConfig";

interface Props {
  whiteboardContent?: string | null;
}

let { whiteboardContent = $bindable() }: Props = $props();

onMount(() => {
  editor = createEditor({
    extensions: [
      Placeholder.configure({
        placeholder: m.whiteboardPlaceholder(),
      }),
      ...extensions,
    ],
    content: whiteboardContent,
    autofocus: true,
    onUpdate: ({ editor }) => {
      whiteboardContent = editor.getHTML();
    },
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
