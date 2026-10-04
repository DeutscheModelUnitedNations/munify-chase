import type { Attachment } from 'svelte/attachments';

/**
 * Opens the `:::live` demos rendered into a manual page in a near-fullscreen dialog
 * once the reader clicks "Try it live". The page runs at its real size there,
 * squeezed into the article column it would be too small to use.
 */
export function liveEmbeds(closeLabel: string): Attachment<HTMLElement> {
	return (article) => {
		function open(container: HTMLElement) {
			const src = container.dataset.liveSrc;
			if (!src) return;

			const dialog = document.createElement('dialog');
			dialog.className = 'modal docs-live-dialog';

			const box = document.createElement('div');
			box.className =
				'modal-box flex h-[92vh] w-[96vw] max-w-none flex-col gap-3 overflow-hidden p-3';

			const header = document.createElement('div');
			header.className = 'flex items-center justify-end gap-2';
			// Reuse the "open in new tab" link of the placeholder
			const newTab = container.querySelector('a')?.cloneNode(true);
			if (newTab) header.append(newTab);
			const close = document.createElement('button');
			close.type = 'button';
			close.className = 'btn btn-sm';
			close.textContent = closeLabel;
			close.addEventListener('click', () => dialog.close());
			header.append(close);

			const iframe = document.createElement('iframe');
			iframe.src = src;
			iframe.title = src;
			iframe.className = 'rounded-box border-base-300 w-full flex-1 border';

			// A click outside the box closes the dialog
			const backdrop = document.createElement('form');
			backdrop.method = 'dialog';
			backdrop.className = 'modal-backdrop';
			backdrop.append(document.createElement('button'));

			box.append(header, iframe);
			dialog.append(box, backdrop);
			dialog.addEventListener('close', () => dialog.remove());
			document.body.append(dialog);
			dialog.showModal();
		}

		function onClick(event: MouseEvent) {
			const button = (event.target as HTMLElement).closest('[data-docs-live-start]');
			const container = button?.closest<HTMLElement>('.docs-live');
			if (container) open(container);
		}

		article.addEventListener('click', onClick);
		return () => {
			article.removeEventListener('click', onClick);
			for (const dialog of document.querySelectorAll('dialog.docs-live-dialog')) dialog.remove();
		};
	};
}
