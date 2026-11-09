import { AxeBuilder } from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';

// axe-core over the public pages and the offline demo conference (no database rows, no sign in),
// and the keyboard paths it cannot judge. The default DMUN look keeps its pale semantic colours
// (a design decision), so contrast is checked in the high contrast variant
// (`#lib/helpers/contrast`), which is the one that has to pass.

const DEMO = '/app/localconference';
const ROUTES = [
	'/',
	'/docs/user-manual/introduction',
	`${DEMO}/mission-control`,
	`${DEMO}/localcommittee/setup`,
	`${DEMO}/localcommittee/speakers-list`,
	`${DEMO}/localcommittee/voting`,
	`${DEMO}/localcommittee/presence`,
	`${DEMO}/localcommittee`
];

/** The serious and critical WCAG 2.2 A/AA violations on the page, one line each. */
async function violations(page: Page, { contrast }: { contrast: boolean }) {
	const builder = new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
		// The value inspector `vite dev` mounts
		.exclude('.inspect-panel');
	if (!contrast) builder.disableRules(['color-contrast']);
	const { violations } = await builder.analyze();
	return violations
		.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
		.flatMap((violation) =>
			violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')}`)
		);
}

async function scan(page: Page, { contrast }: { contrast: boolean }) {
	// Sections that fade in on scrolling are shown at once, as for anyone who asks for less motion
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const found: string[] = [];
	for (const path of ROUTES) {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
		found.push(...(await violations(page, { contrast })).map((line) => `${path} ${line}`));
	}
	return found;
}

test.describe('pages', () => {
	test.setTimeout(180_000);

	test('have no serious violations', async ({ page }) => {
		expect(await scan(page, { contrast: false })).toEqual([]);
	});

	for (const theme of ['light', 'dark']) {
		test(`pass contrast in high contrast, ${theme}`, async ({ page }) => {
			await page.addInitScript((theme) => {
				localStorage.setItem('contrast', 'more');
				localStorage.setItem('theme', theme);
			}, theme);
			expect(await scan(page, { contrast: true })).toEqual([]);
		});
	}
});

test('the first Tab reaches the skip link, which moves on to the content', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.keyboard.press('Tab');
	const skip = page.getByRole('link', { name: /zum inhalt springen|skip to content/i });
	await expect(skip).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('main#main-content')).toBeFocused();
});

test('the high contrast toggle applies at once and stays chosen', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const toggle = page.getByRole('button', { name: /hoher kontrast|high contrast/i });
	await expect(toggle).toHaveAttribute('aria-pressed', 'false');
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('html')).toHaveAttribute('data-contrast', 'more');
	await page.reload();
	// Set before the first paint, by the script in app.html
	await expect(page.locator('html')).toHaveAttribute('data-contrast', 'more');
});

test('the theme and language buttons say what they are set to', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('button', { name: /^(theme|design): /i })).toBeVisible();
	await expect(page.getByRole('button', { name: /^(sprache|language): /i })).toBeVisible();
});

test('a dialog takes the focus, keeps it, and hands it back on Escape', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const opener = page.getByRole('button', { name: /^(sprache|language): /i });
	await opener.click();
	const dialog = page.getByRole('dialog', { name: /sprache|language/i });
	await expect(dialog).toBeVisible();
	await expect(dialog.locator(':focus')).toHaveCount(1);
	// However far Tab goes, it stays inside
	for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
	await expect(dialog.locator(':focus')).toHaveCount(1);
	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
	await expect(opener).toBeFocused();
});
