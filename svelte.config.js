import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			precompress: true
		}),
		alias: {
			$api: 'src/api',
			$assets: 'src/assets',
			$houdini: '.houdini/',
			$config: 'src/lib/config'
		}
	}
};

export default config;
