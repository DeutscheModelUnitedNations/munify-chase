<script lang="ts">
import type { Readable } from "svelte/store";
import type { Editor } from "svelte-tiptap";
import { m } from "$lib/paraglide/messages";

interface Props {
  editor: Editor;
}

const { editor }: Props = $props();

const buttonGroups: {
  label: string;
  icon: string;
  command: () => void;
  active?: () => boolean;
}[][] = [
  [
    {
      label: m.bold(),
      icon: "fa-bold",
      command: () => editor.chain().focus().toggleBold().run(),
      active: () => editor.isActive("bold"),
    },
    {
      label: m.italic(),
      icon: "fa-italic",
      command: () => editor.chain().focus().toggleItalic().run(),
      active: () => editor.isActive("italic"),
    },
    {
      label: m.underline(),
      icon: "fa-underline",
      command: () => editor.chain().focus().toggleUnderline().run(),
      active: () => editor.isActive("underline"),
    },
    {
      label: m.strikethrough(),
      icon: "fa-strikethrough",
      command: () => editor.chain().focus().toggleStrike().run(),
      active: () => editor.isActive("strike"),
    },
  ],
  [
    {
      label: m.code(),
      icon: "fa-code",
      command: () => editor.chain().focus().toggleCode().run(),
      active: () => editor.isActive("code"),
    },
    {
      label: m.link(),
      icon: "fa-link",
      command: () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        } else {
          const url = window.prompt("URL");
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }
        }
      },
      active: () => editor.isActive("link"),
    },
  ],
  [
    {
      label: m.clearFormatting(),
      icon: "fa-eraser",
      command: () => {
        editor.chain().focus().clearNodes().run();
        editor.chain().focus().unsetAllMarks().run();
      },
    },
  ],
];
</script>

<div class="card bg-base-300 flex flex-row flex-nowrap gap-2 p-2 shadow-sm">
	{#each buttonGroups as group}
		<div class="join">
			{#each group as button}
				<div class="tooltip" data-tip={button.label}>
					<button
						class="btn btn-sm join-item {button.active && button.active() ? 'btn-active' : ''}"
						aria-label={button.label}
						onclick={() => button.command()}
					>
						<i class={`fa-duotone ${button.icon}`}></i>
					</button>
				</div>
			{/each}
		</div>
	{/each}
</div>
