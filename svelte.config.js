import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

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
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter({
			precompress: true
		}),
		alias: {
			$api: 'src/api',
			$assets: 'src/assets',
			$config: 'src/lib/config'
		}
	}
};

export default config;
