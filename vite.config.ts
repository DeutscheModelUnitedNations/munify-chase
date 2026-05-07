import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import mkcert from 'vite-plugin-mkcert';

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
	// Yjs throws "Yjs was already imported" if two copies are loaded.
	// Vite prebundles `y-websocket` + `y-protocols/*` and chunks the shared
	// `yjs` they pull in. If we ALSO alias chase's direct `yjs` imports to
	// `node_modules/yjs/dist/yjs.mjs` directly, that bypasses the chunk and
	// loads a SECOND yjs module at runtime. Use `dedupe` (which makes
	// resolution always walk up to the project's yjs) without the alias —
	// then chase's import and the prebundled chunk converge on the same
	// module instance.
	resolve: {
		dedupe: ['yjs', 'y-protocols']
	},
	optimizeDeps: {
		include: ['y-protocols/sync', 'y-protocols/awareness', 'y-websocket'],
		// EXCLUDE yjs from prebundling entirely. When yjs is prebundled,
		// vite ends up with two yjs entries (one for chase's direct import,
		// one as the chunk shared by y-protocols/y-websocket), each with
		// its own module-init scope → "Yjs was already imported" warning.
		// Excluded, every `import 'yjs'` resolves to the single source file
		// at chase/node_modules/yjs/dist/yjs.mjs, ESM-cached once.
		exclude: ['yjs']
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
