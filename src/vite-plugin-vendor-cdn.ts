/**
 * Vite plugin that downloads CDN-hosted assets (CSS + referenced fonts) at build time
 * and rewrites the HTML link tags to use the bundled local copies. Only active during
 * builds — dev mode continues to use the CDN URLs directly.
 */
import type { Plugin } from 'vite';
import { createHash } from 'crypto';

interface CdnAsset {
	url: string;
	localPath: string;
}

const CDN_ASSETS: CdnAsset[] = [
	{
		url: 'https://cdn.dmun.de/cdn/fontawesome-pro-6.7.2/css/fontawesome.min.css',
		localPath: 'vendor/fontawesome/fontawesome.min.css'
	},
	{
		url: 'https://cdn.dmun.de/cdn/fontawesome-pro-6.7.2/css/solid.min.css',
		localPath: 'vendor/fontawesome/solid.min.css'
	},
	{
		url: 'https://cdn.dmun.de/cdn/fontawesome-pro-6.7.2/css/duotone.min.css',
		localPath: 'vendor/fontawesome/duotone.min.css'
	},
	{
		url: 'https://cdn.dmun.de/cdn/fontawesome-pro-6.7.2/css/brands.min.css',
		localPath: 'vendor/fontawesome/brands.min.css'
	}
];

function resolveUrl(base: string, relative: string): string {
	return new URL(relative, base).toString();
}

function urlToLocalPath(url: string, baseDir: string): string {
	const parsed = new URL(url);
	// e.g. /cdn/fontawesome-pro-6.7.2/webfonts/fa-solid-900.woff2
	// → vendor/fontawesome/webfonts/fa-solid-900.woff2
	const parts = parsed.pathname.split('/');
	const filename = parts[parts.length - 1];
	const isWebfont = parsed.pathname.includes('webfonts');
	return isWebfont ? `${baseDir}/webfonts/${filename}` : `${baseDir}/${filename}`;
}

async function fetchBuffer(url: string): Promise<Buffer> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
	return Buffer.from(await res.arrayBuffer());
}

export function vendorCdnPlugin(): Plugin {
	// Map from original CDN URL → emitted local path (relative to output root, with leading /)
	const urlMap = new Map<string, string>();
	// Map from local path → file content buffer
	const emitQueue = new Map<string, Buffer>();

	return {
		name: 'vendor-cdn-assets',
		apply: 'build',

		async buildStart() {
			for (const asset of CDN_ASSETS) {
				const cssBaseDir = asset.localPath.replace(/\/[^/]+$/, ''); // parent dir

				console.log(`[vendor-cdn] Fetching ${asset.url}`);
				let cssContent = (await fetchBuffer(asset.url)).toString('utf-8');

				// Find all url(...) references in the CSS
				const urlPattern = /url\(["']?([^"')]+)["']?\)/g;
				let match: RegExpExecArray | null;
				const fontReplacements: Array<{ original: string; local: string }> = [];

				while ((match = urlPattern.exec(cssContent)) !== null) {
					const ref = match[1];
					// Only process relative paths or CDN-relative font refs (skip data: and absolute non-CDN)
					if (ref.startsWith('data:')) continue;

					const absoluteRef = ref.startsWith('http') ? ref : resolveUrl(asset.url, ref);
					const localPath = urlToLocalPath(absoluteRef, cssBaseDir);

					if (!emitQueue.has(localPath)) {
						console.log(`[vendor-cdn] Fetching font ${absoluteRef}`);
						const buf = await fetchBuffer(absoluteRef);
						emitQueue.set(localPath, buf);
					}

					fontReplacements.push({ original: match[1], local: `/${localPath}` });
					urlMap.set(absoluteRef, `/${localPath}`);
				}

				// Rewrite font URLs in CSS content
				for (const { original, local } of fontReplacements) {
					cssContent = cssContent.replace(
						new RegExp(`url\\(["']?${escapeRegex(original)}["']?\\)`, 'g'),
						`url(${local})`
					);
				}

				emitQueue.set(asset.localPath, Buffer.from(cssContent, 'utf-8'));
				urlMap.set(asset.url, `/${asset.localPath}`);
			}
		},

		generateBundle() {
			for (const [localPath, content] of emitQueue) {
				this.emitFile({
					type: 'asset',
					fileName: localPath,
					source: content
				});
			}
		},

		transformIndexHtml(html) {
			// Replace CDN <link> hrefs with local paths
			for (const [cdnUrl, localPath] of urlMap) {
				html = html.replace(new RegExp(escapeRegex(cdnUrl), 'g'), localPath);
			}
			return html;
		}
	};
}

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
