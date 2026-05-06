import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function wsPlugin() {
	return {
		name: 'ws-dev',
		configureServer(server: ViteDevServer) {
			server.httpServer?.on('upgrade', (req, socket, head) => {
				if ((globalThis as any).__wssUpgrade) {
					(globalThis as any).__wssUpgrade(req, socket, head);
				}
			});
		}
	};
}

function devAutoRestart() {
	const RACE_CONDITION_PATTERNS = [
		'has not been implemented', // Pothos ObjectRef race condition
		'Class extends value undefined is not a constructor or null', // urql/svelte race condition
		'Received multiple implementations for plugin' // Pothos plugin re-registration after Vite reload
	];

	return {
		name: 'dev-auto-restart',
		configureServer(server: ViteDevServer) {
			let restarting = false;

			const triggerRestart = (label: string) => {
				if (restarting) return;
				restarting = true;
				console.warn(`\n⚠️  ${label}, restarting dev server...\n`);
				server.restart();
			};

			const isRaceCondition = (message: string | undefined) =>
				RACE_CONDITION_PATTERNS.some((pattern) => message?.includes(pattern));

			const onUnhandledRejection = (reason: unknown) => {
				if (reason instanceof Error && isRaceCondition(reason.message)) {
					triggerRestart('Race condition detected');
				}
			};

			process.on('unhandledRejection', onUnhandledRejection);
			server.httpServer?.on('close', () => {
				process.off('unhandledRejection', onUnhandledRejection);
			});

			const originalSsrFixStacktrace = server.ssrFixStacktrace;
			server.ssrFixStacktrace = function (e: Error) {
				originalSsrFixStacktrace.call(this, e);
				if (isRaceCondition(e?.message)) {
					triggerRestart('SSR race condition detected');
				}
			};
		}
	};
}

export default defineConfig({
	plugins: [
		mkcert(),
		devAutoRestart(),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit(),
		wsPlugin()
	],
	// Yjs throws "Yjs was already imported" if two copies are loaded — happens
	// easily when a peer-dep library (the resolution editor) ships its own
	// copy. Force a single shared instance via an explicit alias because
	// `dedupe` alone isn't enough when bun has materialised the library's
	// own `node_modules/yjs` from a `file:` link.
	resolve: {
		dedupe: ['yjs', 'y-protocols'],
		alias: {
			yjs: path.resolve(__dirname, 'node_modules/yjs/dist/yjs.mjs')
		}
	},
	optimizeDeps: {
		include: ['yjs', 'y-protocols/sync', 'y-protocols/awareness', 'y-websocket']
	},
	server: {
		allowedHosts: ['svelte-dev.munify.cloud'],
		watch: {
			// Ignore Claude Code worktrees and other internal directories so
			// changes there don't force-reload the dev server.
			ignored: ['**/.claude/**', '**/node_modules/**', '**/.svelte-kit/**']
		}
	}
});
