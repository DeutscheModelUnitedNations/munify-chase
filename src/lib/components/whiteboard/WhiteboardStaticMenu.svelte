<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import type { Editor } from 'svelte-tiptap';
	import type { Readable } from 'svelte/store';
	import UploadImage from './UploadImage.svelte';
	import GenQRCode from './GenQRCode.svelte';

	interface Props {
		editor: Editor;
		committeeID?: string | null;
		conferenceID?: string | null;
	}

	let { editor, committeeID, conferenceID }: Props = $props();
	let showImageModal = $state(false);
	let imageModalResolve: ((value: string | null) => void) | undefined;

	function openImageModal(): Promise<string | null> {
		showImageModal = true;
		return new Promise<string | null>((resolve) => {
			imageModalResolve = resolve;
		});
	}

	let showQRCodeModal = $state(false);
	let qrCodeImageResolve: ((value: string | null) => void) | undefined;

	function openQRCodeModal(): Promise<string | null> {
		showQRCodeModal = true;
		return new Promise<string | null>((resolve) => {
			qrCodeImageResolve = resolve;
			committeeID = committeeID;
			conferenceID = conferenceID;
		});
	}

	let buttonGroups: {
		label: string;
		icon?: string;
		command: () => void;
		active?: () => boolean;
	}[][] = [
		[
			{
				label: m.h1(),
				icon: 'fa-1',
				command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				active: () => editor.isActive('heading', { level: 2 })
			},
			{
				label: m.h2(),
				icon: 'fa-2',
				command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				active: () => editor.isActive('heading', { level: 3 })
			},
			{
				label: m.h3(),
				icon: 'fa-3',
				command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
				active: () => editor.isActive('heading', { level: 4 })
			}
		],
		[
			{
				label: m.bulletedList(),
				icon: 'fa-list-ul',
				command: () => editor.chain().focus().toggleBulletList().run(),
				active: () => editor.isActive('bulletList')
			},
			{
				label: m.numberedList(),
				icon: 'fa-list-ol',
				command: () => editor.chain().focus().toggleOrderedList().run(),
				active: () => editor.isActive('orderedList')
			},
			{
				label: m.blockquote(),
				icon: 'fa-quote-left',
				command: () => editor.chain().focus().toggleBlockquote().run(),
				active: () => editor.isActive('blockquote')
			}
		],
		[
			{
				label: m.horizontalRule(),
				icon: 'fa-ellipsis',
				command: () => editor.chain().focus().setHorizontalRule().run()
			}
		],
		[
			{
				label: m.img(),
				icon: 'fa-image',
				command: async () => {
					const imageUrl = await openImageModal();
					if (imageUrl) {
						editor.chain().focus().setImage({ src: imageUrl }).run();
					}
				}
			},
			{
				label: m.genQRCode(),
				icon: 'fa-qrcode',
				command: async () => {
					const qrCodeURL = await openQRCodeModal();
					if (qrCodeURL) {
						editor.chain().focus().setImage({ src: qrCodeURL }).run();
					}
				}
			}
		],
		[
			{
				label: m.undo(),
				icon: 'fa-rotate-left',
				command: () => editor.chain().focus().undo().run()
			},
			{
				label: m.redo(),
				icon: 'fa-rotate-right',
				command: () => editor.chain().focus().redo().run()
			}
		]
	];
</script>

<div class="card bg-base-300 sticky top-0 z-10 flex flex-row flex-nowrap gap-2 p-2 shadow-sm">
	{#each buttonGroups as group}
		<div class="join">
			{#each group as button}
				<div class="tooltip tooltip-bottom" data-tip={button.label}>
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

<UploadImage
	showModal={showImageModal}
	resolve={(value) => {
		if (imageModalResolve) {
			imageModalResolve(value);
			imageModalResolve = undefined;
			showImageModal = false;
		}
	}}
/>

<GenQRCode
	{committeeID}
	{conferenceID}
	showModal={showQRCodeModal}
	resolve={(value) => {
		if (qrCodeImageResolve) {
			qrCodeImageResolve(value);
			qrCodeImageResolve = undefined;
			showQRCodeModal = false;
		}
	}}
/>
