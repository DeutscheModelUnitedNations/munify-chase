import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	kit: {
		experimental: {
			remoteFunctions: true
		},
		// The Pi kiosk bridges its OIDC session via a top-level form POST from
		// its own local bootstrap page (chase-kiosk-helper.py, always
		// http://127.0.0.1:8081 on every device) to /api/kiosk/session on this
		// origin. That's a legitimate cross-origin form submission, so it needs
		// an explicit CSRF allowlist entry or SvelteKit rejects it with a 403
		// before the request ever reaches our route code.
		csrf: {
			trustedOrigins: ['http://127.0.0.1:8081']
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
