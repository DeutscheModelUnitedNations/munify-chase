import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	// prevent Vite from obscuring rust errors
	clearScreen: false,
	plugins: [
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit()
	],
	resolve: {
		dedupe: ['yjs', 'y-protocols']
	},
	optimizeDeps: {
		include: ['y-protocols/sync', 'y-protocols/awareness', '@hocuspocus/provider'],
		exclude: ['yjs']
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
