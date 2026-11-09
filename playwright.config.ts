import { defineConfig, devices } from '@playwright/test';

/**
 * Accessibility checks in a real browser (`bun run test:e2e`). They need no database rows and no
 * sign in: the public pages and the offline demo conference run without either. A dev server
 * already on the port is reused outside CI. `E2E_PORT` moves it off ports other projects hold.
 */
const PORT = Number(process.env.E2E_PORT ?? 4180);

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
		locale: 'de-DE'
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `bunx vite dev --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});
