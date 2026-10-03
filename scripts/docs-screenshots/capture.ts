import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type BrowserContext } from 'playwright';
import { SCREENSHOT_THEMES } from '../../src/lib/docs/screenshots';
import { SHOTS } from './shots';
import { stage } from './stage';
import { ROLE_LOGINS, type MessageKey, type Role, type Shot, type Translate } from './types';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const OUT_DIR = join(ROOT, 'static/docs-assets/screenshots');
// DOCS_LOCALES / DOCS_THEMES (comma separated) narrow a run while working on a shot
const LOCALES = process.env.DOCS_LOCALES?.split(',') ?? ['en', 'de', 'pt'];
const THEMES = process.env.DOCS_THEMES?.split(',') ?? SCREENSHOT_THEMES;
const DEFAULT_VIEWPORT = { width: 1280, height: 800 };
const SETTLE_MS = 2000;

// Animations and transitions would otherwise be captured halfway
const FREEZE_CSS = `*, *::before, *::after {
	animation-duration: 0s !important;
	animation-delay: 0s !important;
	transition-duration: 0s !important;
	transition-delay: 0s !important;
	caret-color: transparent !important;
}`;

const MESSAGES_DIR = join(ROOT, 'messages');

async function translator(locale: string): Promise<Translate> {
	const messages: Record<string, string> = JSON.parse(
		await readFile(join(MESSAGES_DIR, `${locale}.json`), 'utf8')
	);
	return (key: MessageKey) => {
		const message = messages[key];
		if (message === undefined) throw new Error(`Unknown message ${key}`);
		return message;
	};
}

type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

async function login(browser: Browser, baseUrl: string, role: Role): Promise<StorageState> {
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto(`${baseUrl}/app`);
	await page.locator(`button[name="sub"][value="${ROLE_LOGINS[role]}"]`).click();
	await page.waitForURL((url) => url.href.startsWith(`${baseUrl}/app`), { timeout: 30_000 });
	const state = await context.storageState();
	await context.close();
	return state;
}

type CaptureOptions = {
	browser: Browser;
	baseUrl: string;
	states: Partial<Record<Role, StorageState>>;
	locale: string;
	theme: string;
	t: Translate;
};

async function newContext(
	{ browser, baseUrl, states, locale, theme }: CaptureOptions,
	role: Role,
	shot?: Shot
) {
	const context = await browser.newContext({
		storageState: states[role],
		viewport: shot?.viewport ?? DEFAULT_VIEWPORT,
		colorScheme: theme === 'dark' ? 'dark' : 'light',
		reducedMotion: 'reduce',
		locale
	});
	await context.addCookies([{ name: 'PARAGLIDE_LOCALE', value: locale, url: baseUrl }]);
	await context.addInitScript(
		(entries) => {
			for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
		},
		{ theme, ...shot?.storage }
	);
	return context;
}

async function captureShot(shot: Shot, options: CaptureOptions) {
	const ids = await stage(options.t);
	await shot.setup?.(ids);

	const contexts: BrowserContext[] = [];
	try {
		const context = await newContext(options, shot.role, shot);
		contexts.push(context);
		const page = await context.newPage();
		await page.goto(`${options.baseUrl}${shot.path(ids)}`, { waitUntil: 'load' });
		await page.addStyleTag({ content: FREEZE_CSS });
		// Live queries keep connections open, so there is no network idle to wait for
		await page.waitForTimeout(SETTLE_MS);

		await shot.prepare?.({
			page,
			ids,
			t: options.t,
			openAs: async (role, path) => {
				const other = await newContext(options, role);
				contexts.push(other);
				const otherPage = await other.newPage();
				await otherPage.goto(`${options.baseUrl}${path}`, { waitUntil: 'load' });
				await otherPage.waitForTimeout(SETTLE_MS);
				return otherPage;
			}
		});
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(400);

		const path = join(OUT_DIR, options.locale, options.theme, `${shot.id}.jpg`);
		await mkdir(dirname(path), { recursive: true });
		const screenshot = { path, type: 'jpeg', quality: 82 } as const;
		if (typeof shot.clip === 'function') await shot.clip(page, options.t).screenshot(screenshot);
		else if (shot.clip) await page.locator(shot.clip).first().screenshot(screenshot);
		else await page.screenshot({ ...screenshot, fullPage: shot.fullPage });
	} finally {
		for (const context of contexts) await context.close();
	}
}

/**
 * Captures every shot in every locale and theme. `filter` limits the run to ids
 * starting with it, e.g. `chair/`.
 */
export async function capture(baseUrl: string, filter?: string) {
	const shots = SHOTS.filter((s) => !filter || s.id.startsWith(filter));
	const browser = await chromium.launch();
	const failures: string[] = [];
	try {
		const roles = Object.keys(ROLE_LOGINS) as Role[];
		const states: CaptureOptions['states'] = {};
		for (const role of roles) states[role] = await login(browser, baseUrl, role);

		for (const shot of shots) {
			for (const locale of LOCALES) {
				const t = await translator(locale);
				for (const theme of THEMES) {
					const options = { browser, baseUrl, states, locale, theme, t };
					try {
						await captureShot(shot, options).catch(() =>
							// Vite occasionally reloads a page while optimizing dependencies
							captureShot(shot, options)
						);
					} catch (error) {
						failures.push(`${shot.id} (${locale}, ${theme}): ${(error as Error).message}`);
					}
				}
			}
			console.info(`captured ${shot.id}`);
		}
	} finally {
		await browser.close();
	}
	return failures;
}
