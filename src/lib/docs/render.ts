import {
	escapeHtml,
	renderDoc,
	type TokenizerAndRendererExtension
} from '@deutschemodelunitednations/docs-kit';
import { liveDemoUrl } from './live';

export type LiveLabels = { start: string; hint: string; openInTab: string };

/** `:::live chair/speakers-list` embeds a page of the offline demo conference */
function liveDemoExtension(labels: LiveLabels): TokenizerAndRendererExtension {
	return {
		name: 'live',
		level: 'block',
		start: (src) => src.match(/^:::live /m)?.index,
		tokenizer(src) {
			const match = /^:::live[ \t]+([\w/-]+)[ \t]*(?:\n|$)/.exec(src);
			if (!match) return;
			return { type: 'live', raw: match[0], id: match[1] };
		},
		renderer(token) {
			const url = liveDemoUrl(token.id);
			if (!url) return '';
			const { start, hint, openInTab } = labels;
			return `<div class="docs-live not-prose rounded-box border-base-300 bg-base-200 my-6 flex flex-wrap items-center gap-3 border p-4" data-live-src="${escapeHtml(url)}"><button type="button" class="btn btn-primary btn-sm" data-docs-live-start><i class="fa-duotone fa-play"></i>${escapeHtml(start)}</button><span class="flex-1 text-sm opacity-70">${escapeHtml(hint)}</span><a class="link link-hover text-sm" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(openInTab)}</a></div>`;
		}
	};
}

/**
 * Renders one manual page: the kit's markdown (admonitions, `{#id}` headings, `shot:`
 * screenshots) plus chase's live demo embeds.
 */
export function renderChaseDoc({
	source,
	slug,
	locale,
	liveLabels
}: {
	source: string;
	slug: string;
	/** Locale of the screenshots, the reader's locale even when the text falls back */
	locale: string;
	liveLabels: LiveLabels;
}) {
	return renderDoc({ source, slug, locale, extensions: [liveDemoExtension(liveLabels)] });
}
