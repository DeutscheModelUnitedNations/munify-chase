import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { oidcMock } from 'oidc-mock/vite';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';

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
		'has not been implemented' /* Pothos ObjectRef race condition */,
		'Class extends value undefined is not a constructor or null' /* urql/svelte race condition */,
		'Received multiple implementations for plugin' /* Pothos plugin re-registration after Vite reload */
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

// web-llm ships one self-contained 6.5MB module whose only `new URL(..., import.meta.url)`
// is a JSDoc example. That match makes vite:asset-import-meta-url run its literal-stripping
// regex over the whole file, which overflows the stack the first time a page lazily imports
// web-llm (e.g. mission control). Changing the case inside the comment skips that scan and
// keeps every position in the file unchanged.
function webLlmImportMetaUrlFix() {
	const example = "new URL('./worker.ts', import.meta.url)";
	return {
		name: 'web-llm-import-meta-url-fix',
		enforce: 'pre' as const,
		transform(code: string, id: string) {
			if (!id.includes('/@mlc-ai/web-llm/lib/index.js') || !code.includes(example)) return;
			return {
				code: code.replace(example, "new URL('./worker.ts', import.meta.URL)"),
				map: null
			};
		}
	};
}

export default defineConfig({
	plugins: [
		webLlmImportMetaUrlFix(),
		// mkcert(),
		devAutoRestart(),
		// Local OIDC provider for development, users are configured in oidc-mock.yaml
		oidcMock(),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
		}),

		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: {
				experimental: { async: true },
				warningFilter: (warning) => warning.code !== 'state_referenced_locally'
			},
			experimental: { remoteFunctions: true },
			adapter: adapter({ precompress: true })
		}),
		wsPlugin()
	],
	// Yjs throws "Yjs was already imported" if two copies are loaded.
	// Vite prebundles `@hocuspocus/provider` + `y-protocols/*` and chunks the
	// shared `yjs` they pull in. If we ALSO alias chase's direct `yjs` imports
	// to `node_modules/yjs/dist/yjs.mjs` directly, that bypasses the chunk and
	// loads a SECOND yjs module at runtime. Use `dedupe` (which makes
	// resolution always walk up to the project's yjs) without the alias —
	// then chase's import and the prebundled chunk converge on the same
	// module instance.
	resolve: {
		dedupe: ['yjs', 'y-protocols']
	},
	optimizeDeps: {
		include: ['y-protocols/sync', 'y-protocols/awareness', '@hocuspocus/provider'],
		// EXCLUDE yjs from prebundling entirely. When yjs is prebundled,
		// vite ends up with two yjs entries (one for chase's direct import,
		// one as the chunk shared by y-protocols/@hocuspocus/provider), each
		// with its own module-init scope → "Yjs was already imported" warning.
		// Excluded, every `import 'yjs'` resolves to the single source file
		// at chase/node_modules/yjs/dist/yjs.mjs, ESM-cached once.
		// web-llm: prebundling runs the same overflowing scan (see webLlmImportMetaUrlFix),
		// and config plugins don't apply there. It is a self-contained ES module, so it can
		// be served as is.
		exclude: ['yjs', '@mlc-ai/web-llm']
	},
	// worker.ts imports web-llm too, and worker bundles get their own plugin list
	worker: {
		plugins: () => [webLlmImportMetaUrlFix()]
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
