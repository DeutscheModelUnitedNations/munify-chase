import type { Attachment } from 'svelte/attachments';

// The demo renders at a desktop size and is scaled down to the article width
const DEMO_WIDTH = 1280;
const DEMO_HEIGHT = 800;

/**
 * Turns the `:::live` placeholders rendered into a manual page into embedded demo
 * pages once the reader clicks "Try it live". Loading on click keeps the app out of
 * the page until someone actually wants it.
 */
export function liveEmbeds(closeLabel: string): Attachment<HTMLElement> {
	return (article) => {
		const observers: ResizeObserver[] = [];

		function start(container: HTMLElement) {
			const src = container.dataset.liveSrc;
			if (!src) return;
			const placeholder = [...container.childNodes];

			const frameBox = document.createElement('div');
			frameBox.className = 'relative w-full overflow-hidden rounded-box border border-base-300';
			frameBox.style.aspectRatio = `${DEMO_WIDTH} / ${DEMO_HEIGHT}`;

			const iframe = document.createElement('iframe');
			iframe.src = src;
			iframe.title = src;
			iframe.style.cssText = `position:absolute;inset:0 auto auto 0;width:${DEMO_WIDTH}px;height:${DEMO_HEIGHT}px;border:0;transform-origin:0 0`;
			frameBox.append(iframe);

			const observer = new ResizeObserver(() => {
				iframe.style.transform = `scale(${frameBox.clientWidth / DEMO_WIDTH})`;
			});
			observer.observe(frameBox);
			observers.push(observer);

			const close = document.createElement('button');
			close.type = 'button';
			close.className = 'btn btn-ghost btn-sm';
			close.textContent = closeLabel;
			close.addEventListener('click', () => {
				observer.disconnect();
				container.replaceChildren(...placeholder);
				container.classList.add('flex');
			});

			container.classList.remove('flex');
			container.replaceChildren(frameBox, close);
		}

		function onClick(event: MouseEvent) {
			const button = (event.target as HTMLElement).closest('[data-docs-live-start]');
			const container = button?.closest<HTMLElement>('.docs-live');
			if (container) start(container);
		}

		article.addEventListener('click', onClick);
		return () => {
			article.removeEventListener('click', onClick);
			for (const observer of observers) observer.disconnect();
		};
	};
}
