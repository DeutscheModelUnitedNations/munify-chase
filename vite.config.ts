import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import mkcert from 'vite-plugin-mkcert';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

function wsPlugin() {
	return {
		name: 'ws-dev',
		configureServer(server: ViteDevServer) {
			server.httpServer?.on('upgrade', (req, socket, head) => {
				const g = globalThis as typeof globalThis & {
					__wssUpgrade?: (req: IncomingMessage, socket: Duplex, head: Buffer) => void;
				};
				if (g.__wssUpgrade) {
					g.__wssUpgrade(req, socket, head);
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
	// prevent Vite from obscuring rust errors
	clearScreen: false,
	// Tauri expects a fixed port, fail if that port is not available
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
			// ignore src-tauri and internal directories
			ignored: ['**/src-tauri/**', '**/.claude/**', '**/node_modules/**', '**/.svelte-kit/**']
		}
	},
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
	resolve: {
		dedupe: ['yjs', 'y-protocols']
	},
	optimizeDeps: {
		include: ['y-protocols/sync', 'y-protocols/awareness', 'y-websocket'],
		exclude: ['yjs']
	}
});
