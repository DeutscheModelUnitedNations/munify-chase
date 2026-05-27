import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	kit: {
		// remoteFunctions requires a server runtime — not available in Tauri/static mode
		// experimental: {
		// 	remoteFunctions: true
		// },
		adapter: adapter({
			fallback: 'index.html'
		}),
		alias: {
			$assets: 'src/assets',
			$config: 'src/lib/config'
		}
	}
};

export default config;
