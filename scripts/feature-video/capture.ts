/**
 * Captures the screens of the landing page feature video at 80% browser zoom and records
 * where the elements the video points at (buttons, menu items, phase steps) sit in each
 * capture, so the composition never relies on hand-measured pixel positions.
 *
 *   bun run video:capture
 *
 * Reuses the docs screenshot staging (scripts/docs-screenshots) on its own database
 * (DOCS_DATABASE_URL, default `chase_docs`) and starts its own dev server. Stop your own
 * dev server first, both need port 5173 and the mock OIDC port 8090.
 *
 * Output: scripts/feature-video/.out/assets/*.png and .out/anchors.json
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { openSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import type { Browser, BrowserContext, Locator, Page } from 'playwright';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const OUT = join(ROOT, 'scripts/feature-video/.out');
const ASSETS = join(OUT, 'assets');

/** Browser zoom the screens are captured at: more of each layout, less crowded UI */
const ZOOM = 0.8;
/** Render density, so captures stay sharp when the video's camera pushes in */
const DSF = 1.2;
const SETTLE_MS = 2500;

const DATABASE_URL =
	process.env.DOCS_DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/chase_docs';
// Everything below, including the staging, must hit the docs database, never the dev database
process.env.DATABASE_URL = DATABASE_URL;
// A locally trusted dev certificate (vite-plugin-mkcert) is fine to talk to
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const env = { ...process.env };

const { chromium } = await import('playwright');
const { SHOTS } = await import('../docs-screenshots/shots');
const { stage } = await import('../docs-screenshots/stage');
const { ROLE_LOGINS } = await import('../docs-screenshots/types');
type Role = keyof typeof ROLE_LOGINS;

const en: Record<string, string> = (await import('../../messages/en.json')).default;
const t = (key: string) => {
	if (!(key in en)) throw new Error(`Unknown message ${key}`);
	return en[key];
};

// Freezes animations and hides the dev-only inspect panel (svelte-inspect-value) and
// hover tooltips, which would otherwise end up in the captures
const CAPTURE_CSS = `*, *::before, *::after {
	animation-duration: 0s !important; animation-delay: 0s !important;
	transition-duration: 0s !important; transition-delay: 0s !important;
	caret-color: transparent !important;
}
.tooltip::before, .tooltip::after { display: none !important; }
.inspect-panel, vite-error-overlay { display: none !important; }`;

type Rect = { x: number; y: number; w: number; h: number };
type Capture = { w: number; h: number; anchors: Record<string, Rect> };
const captures: Record<string, Capture> = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function run(cmd: string[]) {
	return new Promise<void>((resolve, reject) => {
		const proc = spawn(cmd[0], cmd.slice(1), { env, stdio: 'inherit' });
		proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd.join(' ')} failed`))));
	});
}

async function ensureDatabase() {
	const url = new URL(DATABASE_URL);
	const name = url.pathname.slice(1);
	url.pathname = '/postgres';
	const client = new pg.Client({ connectionString: url.href });
	await client.connect();
	const exists = await client.query('select 1 from pg_database where datname = $1', [name]);
	if (exists.rowCount === 0) await client.query(`create database "${name}"`);
	await client.end();
}

async function findBaseUrl(server: ReturnType<typeof spawn>) {
	for (let i = 0; i < 120; i++) {
		if (server.exitCode !== null) throw new Error('Dev server exited, see .out/server.log');
		for (const base of ['https://localhost:5173', 'http://localhost:5173']) {
			try {
				if ((await fetch(base)).ok) return base;
			} catch {
				// not up yet, or the other protocol
			}
		}
		await sleep(1000);
	}
	throw new Error('Dev server did not start');
}

/** Bounding box of a locator in capture pixels, relative to `origin` (a clipped element) */
async function rect(locator: Locator, origin?: Rect): Promise<Rect> {
	const box = await locator.boundingBox();
	if (!box) throw new Error(`No bounding box for ${locator}`);
	const ox = origin?.x ?? 0;
	const oy = origin?.y ?? 0;
	return {
		x: Math.round((box.x - ox) * DSF),
		y: Math.round((box.y - oy) * DSF),
		w: Math.round(box.width * DSF),
		h: Math.round(box.height * DSF)
	};
}

/** Circle markers of a DaisyUI `steps` list, drawn by each step's ::after */
async function stepCircles(page: Page, selector: string): Promise<Rect[]> {
	const circles = await page.locator(`${selector} > li`).evaluateAll((items) =>
		items.map((li) => {
			const box = li.getBoundingClientRect();
			const size = parseFloat(getComputedStyle(li, '::after').height) || 32;
			return { x: box.left + box.width / 2 - size / 2, y: box.top, w: size, h: size };
		})
	);
	return circles.map((c) => ({
		x: Math.round(c.x * DSF),
		y: Math.round(c.y * DSF),
		w: Math.round(c.w * DSF),
		h: Math.round(c.h * DSF)
	}));
}

async function pngSize(path: string) {
	const buf = Buffer.from(await Bun.file(path).arrayBuffer());
	return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

async function save(name: string, shoot: (path: string) => Promise<unknown>, anchors: Record<string, Rect> = {}) {
	const path = join(ASSETS, `${name}.png`);
	await shoot(path);
	captures[name] = { ...(await pngSize(path)), anchors };
	console.info(`captured ${name}`);
}

// ── Main ────────────────────────────────────────────────────────────────────

await mkdir(ASSETS, { recursive: true });
await ensureDatabase();
await run(['bun', 'run', 'db:migrate']);
await run(['bun', 'run', 'db:seed:dev']);

// Vite's dependency pre-bundling of @mlc-ai/web-llm overflows Node's default stack on
// macOS, which turns every page that loads it into a 500. Raising the thread stack limit
// and V8's stack size together avoids that (V8's alone would crash past the OS limit).
const log = openSync(join(OUT, 'server.log'), 'w');
const server = spawn(
	'sh',
	['-c', 'ulimit -s 65520 2>/dev/null || ulimit -s unlimited; exec node --stack-size=60000 node_modules/vite/bin/vite.js dev'],
	{ env, stdio: ['ignore', log, log] }
);

let browser: Browser | undefined;
try {
	const base = await findBaseUrl(server);
	browser = await chromium.launch();

	const states: Partial<Record<Role, Awaited<ReturnType<BrowserContext['storageState']>>>> = {};
	for (const role of Object.keys(ROLE_LOGINS) as Role[]) {
		const context = await browser.newContext({ ignoreHTTPSErrors: true });
		const page = await context.newPage();
		await page.goto(`${base}/app`);
		await page.locator(`button[name="sub"][value="${ROLE_LOGINS[role]}"]`).click();
		await page.waitForURL((url) => url.href.startsWith(`${base}/app`), { timeout: 30_000 });
		states[role] = await context.storageState();
		await context.close();
	}

	const newContext = async (role: Role | undefined, viewport: { width: number; height: number }, storage = {}) => {
		const context = await browser!.newContext({
			storageState: role ? states[role] : undefined,
			viewport: { width: Math.round(viewport.width / ZOOM), height: Math.round(viewport.height / ZOOM) },
			deviceScaleFactor: DSF,
			ignoreHTTPSErrors: true,
			colorScheme: 'light',
			reducedMotion: 'reduce',
			locale: 'en'
		});
		await context.addCookies([{ name: 'PARAGLIDE_LOCALE', value: 'en', url: base }]);
		await context.addInitScript(
			(entries) => {
				for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value as string);
			},
			{ theme: 'light', ...storage }
		);
		return context;
	};

	const open = async (context: BrowserContext, path: string) => {
		const page = await context.newPage();
		await page.goto(`${base}${path}`, { waitUntil: 'load' });
		await page.addStyleTag({ content: CAPTURE_CSS });
		await page.waitForTimeout(SETTLE_MS);
		return page;
	};

	const ready = async (page: Page) => {
		if (await page.getByText('Internal Error').count()) throw new Error('error page');
		await page.evaluate(() => document.fonts.ready);
		await page.mouse.move(1, 1);
		await page.waitForTimeout(800);
	};

	/** Docs shots: staged conference, per-shot setup and prepare steps, then `extra` for anchors */
	type Extra = (page: Page, origin?: Rect) => Promise<Record<string, Rect>>;
	const docsShot = async (id: string, name: string, extra: Extra = async () => ({})) => {
		const shot = SHOTS.find((s) => s.id === id);
		if (!shot) throw new Error(`Unknown docs shot ${id}`);
		for (let attempt = 1; ; attempt++) {
			const contexts: BrowserContext[] = [];
			try {
				const ids = await stage(t as never);
				await shot.setup?.(ids);
				const context = await newContext(shot.role, shot.viewport ?? { width: 1280, height: 800 }, shot.storage);
				contexts.push(context);
				const page = await open(context, shot.path(ids));
				// Pages built on the resolution editor hydrate late, clicks before that are lost
				if (id.startsWith('chair/amendment')) await page.getByText('Reaffirming').first().waitFor({ timeout: 30_000 });
				await shot.prepare?.({
					page,
					ids,
					t: t as never,
					openAs: async (role, path) => {
						const other = await newContext(role, { width: 1280, height: 800 });
						contexts.push(other);
						return open(other, path);
					}
				});
				await ready(page);
				const clip =
					typeof shot.clip === 'function'
						? shot.clip(page, t as never)
						: shot.clip
							? page.locator(shot.clip).first()
							: undefined;
				const origin = clip ? ((await clip.boundingBox()) ?? undefined) : undefined;
				const anchors = await extra(page, origin && { x: origin.x, y: origin.y, w: origin.width, h: origin.height });
				await save(name, (path) => (clip ? clip.screenshot({ path }) : page.screenshot({ path })), anchors);
				return;
			} catch (error) {
				if (attempt >= 3) throw error;
				console.warn(`retrying ${id}: ${(error as Error).message}`);
			} finally {
				for (const context of contexts) await context.close();
			}
		}
	};

	await docsShot('chair/speakers-list', 'speakers-list', async (page) => ({
		nextSpeech: await rect(page.getByRole('button', { name: t('nextSpeaker') }).first()),
		currentSpeaker: await rect(page.locator('[data-tour="speakers-list.current-speaker"]').first())
	}));
	await docsShot('chair/presentation-default', 'presentation');
	await docsShot('chair/voting-show-of-hands', 'voting-show-of-hands');
	await docsShot('participant/device-vote', 'device-vote', async (page, origin) => ({
		pro: await rect(page.getByRole('button', { name: t('pro') }).first(), origin)
	}));
	await docsShot('chair/amendment-review', 'amendment-review', async (page) => {
		const steps = await stepCircles(page, '[data-tour="chair-paper.phases"]');
		return {
			...Object.fromEntries(steps.map((step, i) => [`step${i}`, step])),
			startVote: await rect(page.locator('button:visible', { hasText: t('startVote') }).first())
		};
	});

	// Pages outside the docs shot list: no login, offline demo and public pages
	const context = await newContext(undefined, { width: 1600, height: 900 });
	const retry = async (name: string, fn: () => Promise<void>) => {
		for (let attempt = 1; ; attempt++) {
			try {
				return await fn();
			} catch (error) {
				// Vite reloads pages while it optimizes newly discovered dependencies
				if (attempt >= 3) throw error;
				console.warn(`retrying ${name}: ${(error as Error).message}`);
			}
		}
	};

	await retry('docs-speakers-list', async () => {
		const page = await open(context, '/docs/user-manual/chair/speakers-list');
		await ready(page);
		await save('docs-speakers-list', (path) => page.screenshot({ path }));
		await page.close();
	});

	await retry('landing', async () => {
		const page = await open(context, '/');
		await ready(page);
		// The hero button, not the navbar link
		let tryOffline: Rect | undefined;
		for (const link of await page.getByRole('link', { name: t('tryOfflineDemo') }).all()) {
			const r = await rect(link);
			if (!tryOffline || r.h > tryOffline.h) tryOffline = r;
		}
		if (!tryOffline) throw new Error('no offline demo link');
		await save('landing', (path) => page.screenshot({ path }), { tryOffline });
		await page.close();
	});

	await retry('demo-help', async () => {
		const page = await open(context, '/app/localconference/localcommittee/speakers-list');
		await page.waitForTimeout(1500);
		await ready(page);
		const help = page.getByRole('button', { name: t('help'), exact: true }).first();
		const helpRect = await rect(help);
		await save('demo-speakers-list', (path) => page.screenshot({ path }), { help: helpRect });
		await help.click();
		await page.mouse.move(1, 1);
		await page.waitForTimeout(600);
		await save('demo-help-open', (path) => page.screenshot({ path }), {
			help: helpRect,
			manual: await rect(page.getByText(t('helpManualForPage')).first())
		});
		await page.close();
	});

	await retry('demo-mission-control', async () => {
		const page = await open(context, '/app/localconference/mission-control');
		await page.waitForTimeout(1500);
		await ready(page);
		await save('demo-mission-control', (path) => page.screenshot({ path }));
		await page.close();
	});
	await context.close();

	await writeFile(join(OUT, 'anchors.json'), JSON.stringify(captures, null, '\t'));
	console.info(`\nwrote ${Object.keys(captures).length} captures to ${OUT}`);
} finally {
	await browser?.close();
	server.kill();
}
process.exit(0);
