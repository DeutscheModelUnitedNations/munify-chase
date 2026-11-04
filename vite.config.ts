import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vendorCdnPlugin } from './src/vite-plugin-vendor-cdn';

const host = process.env.TAURI_DEV_HOST;

// TAURI_FAMILY is set by `tauri build` / `tauri dev`. Use hash routing in the native
// client so SvelteKit's router doesn't have to deal with the tauri:// URL scheme,
// which WebKit2GTK handles differently from http:// (navigate() fails at startup).
const isTauri = Boolean(process.env.TAURI_FAMILY);

// web-llm ships one self-contained 6.5MB module whose only `new URL(..., import.meta.url)`
// is a JSDoc example. That match makes vite:asset-import-meta-url run its literal-stripping
// regex over the whole file, which overflows the stack the first time a page lazily imports
// web-llm (e.g. mission control). Changing the case inside the comment skips that scan and
// keeps every position in the file unchanged.
function webLlmImportMetaUrlFix() {
	const example = "new URL('./worker.ts', import.meta.url)";
	return {
		name: 'web-llm-import-meta-url-fix',
		enforce: 'pre' as const,
		transform(code: string, id: string) {
			if (!id.includes('/@mlc-ai/web-llm/lib/index.js') || !code.includes(example)) return;
			return {
				code: code.replace(example, "new URL('./worker.ts', import.meta.URL)"),
				map: null
			};
		}
	};
}

export default defineConfig({
	// prevent Vite from obscuring rust errors
	clearScreen: false,
	plugins: [
		webLlmImportMetaUrlFix(),
		vendorCdnPlugin(),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: {
				experimental: { async: true },
				warningFilter: (warning) => warning.code !== 'state_referenced_locally'
			},
			// No remote functions: they need a server runtime, which the static build has not
			adapter: adapter({ fallback: 'index.html' }),
			router: { type: isTauri ? 'hash' : 'pathname' }
		})
	],
	// Yjs throws "Yjs was already imported" if two copies are loaded, see main's vite.config.ts
	resolve: {
		dedupe: ['yjs', 'y-protocols']
	},
	optimizeDeps: {
		include: ['y-protocols/sync', 'y-protocols/awareness', '@hocuspocus/provider'],
		exclude: ['yjs', '@mlc-ai/web-llm']
	},
	// worker.ts imports web-llm too, and worker bundles get their own plugin list
	worker: {
		plugins: () => [webLlmImportMetaUrlFix()]
	},
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421
				}
			: undefined,
		allowedHosts: ['svelte-dev.munify.cloud'],
		watch: {
			ignored: ['**/src-tauri/**', '**/.claude/**', '**/node_modules/**', '**/.svelte-kit/**']
		}
	}
});
