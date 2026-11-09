<script lang="ts">
	import WhiteboardButtonGroups, { type WhiteboardButton } from './WhiteboardButtonGroups.svelte';
	import { m } from '#lib/paraglide/messages';
	import type { Editor } from 'svelte-tiptap';
	import UploadImage from './UploadImage.svelte';
	import GenQRCode from './GenQRCode.svelte';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
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
		});
	}

	let buttonGroups: WhiteboardButton[][] = [
		[
			{
				label: m.h1(),
				icon: 'number-one',
				command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				active: () => editor.isActive('heading', { level: 2 })
			},
			{
				label: m.h2(),
				icon: 'number-two',
				command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				active: () => editor.isActive('heading', { level: 3 })
			},
			{
				label: m.h3(),
				icon: 'number-three',
				command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
				active: () => editor.isActive('heading', { level: 4 })
			}
		],
		[
			{
				label: m.bulletedList(),
				icon: 'list-bullets',
				command: () => editor.chain().focus().toggleBulletList().run(),
				active: () => editor.isActive('bulletList')
			},
			{
				label: m.numberedList(),
				icon: 'list-numbers',
				command: () => editor.chain().focus().toggleOrderedList().run(),
				active: () => editor.isActive('orderedList')
			},
			{
				label: m.blockquote(),
				icon: 'quotes',
				command: () => editor.chain().focus().toggleBlockquote().run(),
				active: () => editor.isActive('blockquote')
			}
		],
		[
			{
				label: m.horizontalRule(),
				icon: 'dots-three',
				command: () => editor.chain().focus().setHorizontalRule().run()
			}
		],
		[
			{
				label: m.img(),
				icon: 'image',
				command: async () => {
					const imageUrl = await openImageModal();
					if (imageUrl) {
						editor.chain().focus().setImage({ src: imageUrl }).run();
					}
				}
			},
			{
				label: m.genQRCode(),
				icon: 'qr-code',
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
				icon: 'arrow-counter-clockwise',
				command: () => editor.chain().focus().undo().run()
			},
			{
				label: m.redo(),
				icon: 'arrow-clockwise',
				command: () => editor.chain().focus().redo().run()
			}
		]
	];
</script>

<WhiteboardButtonGroups {buttonGroups} class="sticky top-0 z-10" tooltipClass="tooltip-bottom" />

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
	showModal={showQRCodeModal}
	resolve={(value) => {
		if (qrCodeImageResolve) {
			qrCodeImageResolve(value);
			qrCodeImageResolve = undefined;
			showQRCodeModal = false;
		}
	}}
/>
