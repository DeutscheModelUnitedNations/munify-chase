import { createDocsContent } from '@deutschemodelunitednations/docs-kit';
import { m } from '#lib/paraglide/messages';
import { baseLocale, type Locale } from '#lib/paraglide/runtime';
import { renderChaseDoc } from './render';

// Markdown sources live in `docs/<locale>/` at the repo root, bundled into the server build
const content = createDocsContent<Locale>({
	sources: import.meta.glob<string>('/docs/*/**/*.md', {
		query: '?raw',
		import: 'default',
		eager: true
	}),
	baseLocale,
	render: ({ source, slug, locale }) =>
		renderChaseDoc({
			source,
			slug,
			locale,
			liveLabels: {
				start: m.docsLiveStart({}, { locale: locale }),
				hint: m.docsLiveHint({}, { locale: locale }),
				openInTab: m.docsLiveOpenInTab({}, { locale: locale })
			}
		})
});

export const { docExists, docTitles } = content;

/** Renders a page in the requested locale, falling back to the base locale. */
export function loadDoc(slug: string, locale: Locale) {
	return content.loadDoc({ slug, locale });
}
