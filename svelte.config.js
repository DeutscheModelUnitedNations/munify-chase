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
		typescript: {
			// Typecheck the docs screenshot scripts with the app, they import its schema.
			// The feature video tooling is a local, best-effort pipeline and stays unchecked.
			config: (config) => ({
				...config,
				include: [...config.include, '../scripts/**/*.ts'],
				exclude: [...(config.exclude ?? []), '../scripts/feature-video/**']
			})
		},
		alias: {
			$api: 'src/api',
			$assets: 'src/assets',
			$config: 'src/lib/config'
		}
	}
};

export default config;
