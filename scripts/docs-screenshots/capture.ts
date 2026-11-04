import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureShots } from '@deutschemodelunitednations/docs-kit/capture';
import { SCREENSHOT_THEMES } from '../../src/lib/docs/screenshots';
import { SHOTS } from './shots';
import { stage } from './stage';
import { ROLE_LOGINS, type MessageKey, type Role, type StageIds } from './types';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
// DOCS_LOCALES / DOCS_THEMES (comma separated) narrow a run while working on a shot
const LOCALES = process.env.DOCS_LOCALES?.split(',') ?? ['en', 'de', 'pt'];
const THEMES = process.env.DOCS_THEMES?.split(',') ?? SCREENSHOT_THEMES;

const ROLES: Role[] = ['admin', 'team', 'delegate'];

/**
 * Captures every shot in every locale and theme. `filter` limits the run to ids
 * starting with it, e.g. `chair/`.
 */
export function capture(baseUrl: string, filter?: string) {
	return captureShots<StageIds, Role, MessageKey>({
		baseUrl,
		shots: SHOTS,
		roles: ROLES,
		filter,
		locales: LOCALES,
		themes: THEMES,
		outDir: join(ROOT, 'static/docs-assets/screenshots'),
		messagesDir: join(ROOT, 'messages'),
		stage,
		async login({ page, baseUrl, role }) {
			await page.goto(`${baseUrl}/app`);
			await page.locator(`button[name="sub"][value="${ROLE_LOGINS[role]}"]`).click();
			await page.waitForURL((url) => url.href.startsWith(`${baseUrl}/app`), { timeout: 30_000 });
		}
	});
}
