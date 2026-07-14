import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

// TAURI_FAMILY is set by `tauri build` / `tauri dev`. Use hash routing in the native
// client so SvelteKit's router doesn't have to deal with the tauri:// URL scheme,
// which WebKit2GTK handles differently from http:// (navigate() fails at startup).
const isTauri = Boolean(process.env.TAURI_FAMILY);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true
		},
		warningFilter: (warning) => warning.code !== 'state_referenced_locally'
	},
	kit: {
		// remoteFunctions requires a server runtime — not available in Tauri/static mode
		// experimental: {
		// 	remoteFunctions: true
		// },
		adapter: adapter({
			fallback: 'index.html'
		}),
		router: {
			type: isTauri ? 'hash' : 'pathname'
		},
		alias: {
			$assets: 'src/assets',
			$config: 'src/lib/config'
		}
	}
};

export default config;
