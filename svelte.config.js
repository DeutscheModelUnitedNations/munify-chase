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
			remoteFunctions: true,
			// Environment variables are declared and validated in `src/env.ts` and read from
			// `$app/env/private` and `$app/env/public`; `$env/*` is off.
			explicitEnvironmentVariables: true
		},
		adapter: adapter({
			precompress: true
		}),
		typescript: {
			// Typecheck the docs screenshot scripts with the app, they import its schema
			config: (config) => ({ ...config, include: [...config.include, '../scripts/**/*.ts'] })
		},
		alias: {
			$api: 'src/api',
			$assets: 'src/assets'
		}
	}
};

export default config;
