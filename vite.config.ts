import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

function devAutoRestart() {
	const RACE_CONDITION_PATTERNS = [
		'has not been implemented', // Pothos ObjectRef race condition
		'Class extends value undefined is not a constructor or null' // urql/svelte race condition
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
		devAutoRestart(),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),
		sveltekit()
	],
	server: {
		allowedHosts: ['svelte-dev.munify.cloud']
	},
	optimizeDeps: {
		exclude: ['@m1212e/rumble']
	}
});
