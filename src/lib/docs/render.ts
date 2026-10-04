import { Marked, type Tokens } from 'marked';
import GithubSlugger from 'github-slugger';
import { load as loadYaml } from 'js-yaml';
import { liveDemoUrl } from './live';
import { SCREENSHOT_THEMES, screenshotPath } from './screenshots';

export type DocsFrontmatter = {
	title?: string;
	description?: string;
	sidebar_position?: number;
};

export type DocsTocEntry = { id: string; text: string; depth: number };

export type RenderedDoc = {
	frontmatter: DocsFrontmatter;
	html: string;
	toc: DocsTocEntry[];
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(source: string): { frontmatter: DocsFrontmatter; body: string } {
	const match = FRONTMATTER.exec(source);
	if (!match) return { frontmatter: {}, body: source };
	return {
		frontmatter: (loadYaml(match[1]) as DocsFrontmatter | undefined) ?? {},
		body: source.slice(match[0].length)
	};
}

// Docusaurus-style admonitions (:::tip Optional title ... :::) mapped to DaisyUI alerts
const ADMONITION_CLASSES: Record<string, { alert: string; icon: string }> = {
	note: { alert: 'alert-info', icon: 'fa-circle-info' },
	info: { alert: 'alert-info', icon: 'fa-circle-info' },
	tip: { alert: 'alert-success', icon: 'fa-lightbulb' },
	caution: { alert: 'alert-warning', icon: 'fa-triangle-exclamation' },
	warning: { alert: 'alert-warning', icon: 'fa-triangle-exclamation' },
	danger: { alert: 'alert-error', icon: 'fa-circle-exclamation' }
};

const EXPLICIT_ID = /\s*\{#([\w-]+)\}\s*$/;

export type RenderOptions = {
	/** Locale of the screenshots, the reader's locale even when the text falls back */
	locale: string;
	liveLabels: { start: string; hint: string; openInTab: string };
};

function escapeHtml(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * Renders one manual page. `slug` is the page's path below `/docs`, needed to turn
 * relative links like `./agenda-status` into absolute app URLs.
 *
 * Besides plain markdown it supports Docusaurus-style admonitions, `{#id}` heading ids,
 * generated screenshots as `![alt](shot:chair/speakers-list)` and live demo embeds as
 * a `:::live chair/speakers-list` line.
 */
export function renderDoc(source: string, slug: string, options: RenderOptions): RenderedDoc {
	const { frontmatter, body } = parseFrontmatter(source);
	const slugger = new GithubSlugger();
	const toc: DocsTocEntry[] = [];
	const base = new URL(`/docs/${slug}`, 'http://docs.local');

	const marked = new Marked({ gfm: true });
	marked.use({
		extensions: [
			{
				name: 'liveDemo',
				level: 'block',
				start: (src) => src.match(/^:::live /m)?.index,
				tokenizer(src) {
					const match = /^:::live[ \t]+([\w/-]+)[ \t]*(?:\n|$)/.exec(src);
					if (!match) return;
					return { type: 'liveDemo', raw: match[0], id: match[1] };
				},
				renderer(token) {
					const url = liveDemoUrl(token.id);
					if (!url) return '';
					const { start, hint, openInTab } = options.liveLabels;
					return `<div class="docs-live not-prose rounded-box border-base-300 bg-base-200 my-6 flex flex-wrap items-center gap-3 border p-4" data-live-src="${escapeHtml(url)}"><button type="button" class="btn btn-primary btn-sm" data-docs-live-start><i class="fa-duotone fa-play"></i>${escapeHtml(start)}</button><span class="flex-1 text-sm opacity-70">${escapeHtml(hint)}</span><a class="link link-hover text-sm" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(openInTab)}</a></div>`;
				}
			},
			{
				name: 'admonition',
				level: 'block',
				start: (src) => src.match(/^:::/m)?.index,
				tokenizer(src) {
					const match = /^:::(\w+)[ \t]*([^\n]*)\n([\s\S]*?)\n:::[ \t]*(?:\n|$)/.exec(src);
					if (!match || match[1] === 'live') return;
					const token = {
						type: 'admonition',
						raw: match[0],
						kind: match[1],
						title: match[2].trim(),
						tokens: [] as Tokens.Generic[]
					};
					this.lexer.blockTokens(match[3], token.tokens);
					return token;
				},
				renderer(token) {
					const style = ADMONITION_CLASSES[token.kind] ?? ADMONITION_CLASSES.note;
					const title = token.title
						? `<p class="font-semibold">${escapeHtml(token.title)}</p>`
						: '';
					const inner = this.parser.parse(token.tokens ?? []);
					return `<div role="note" class="docs-admonition alert alert-soft ${style.alert} not-prose my-6 items-start"><i class="fa-duotone ${style.icon} mt-1"></i><div class="prose prose-sm max-w-none">${title}${inner}</div></div>`;
				}
			}
		],
		renderer: {
			heading({ tokens, depth, text }) {
				let id: string;
				let content = this.parser.parseInline(tokens);
				const explicit = EXPLICIT_ID.exec(text);
				if (explicit) {
					id = explicit[1];
					content = content.replace(EXPLICIT_ID, '');
					text = text.replace(EXPLICIT_ID, '');
				} else {
					id = slugger.slug(text);
				}
				if (depth === 2 || depth === 3) toc.push({ id, text: text.replace(/[*_`]/g, ''), depth });
				if (depth === 1) return `<h1>${content}</h1>`;
				return `<h${depth} id="${id}" class="group scroll-mt-24">${content}<a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-50 no-underline" aria-hidden="true">#</a></h${depth}>`;
			},
			link({ href, title, tokens }) {
				const text = this.parser.parseInline(tokens);
				const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
				if (/^[a-z]+:/i.test(href)) {
					return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
				}
				if (href.startsWith('#')) return `<a href="${escapeHtml(href)}"${titleAttr}>${text}</a>`;
				const url = new URL(href, base);
				return `<a href="${escapeHtml(url.pathname + url.hash)}"${titleAttr}>${text}</a>`;
			},
			image({ href, title, text }) {
				const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
				if (href.startsWith('shot:')) {
					// One image per theme, CSS shows the one matching the app theme
					const id = href.slice('shot:'.length);
					return SCREENSHOT_THEMES.map(
						(theme) =>
							`<img src="${escapeHtml(screenshotPath(options.locale, theme, id))}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" class="docs-shot docs-shot-${theme} rounded-box border border-base-300 shadow-sm" />`
					).join('');
				}
				return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" class="rounded-box border border-base-300 shadow-sm" />`;
			}
		}
	});

	const html = marked.parse(body, { async: false });
	return { frontmatter, html, toc };
}
