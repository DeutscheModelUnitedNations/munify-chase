import { browser } from '$app/env';

type Theme = 'system' | 'dark' | 'light';

let theme: Theme = $state('system');

export function initialSetTheme() {
	setThemeInHTML(getTheme());
}

/** base-100 of the DMUN themes, which the navbars use; mirrored in `app.html` */
const THEME_COLORS = { light: '#FFFFFF', dark: '#1B1837' } as const;

export function setThemeInHTML(newTheme: Theme) {
	const resolved =
		newTheme === 'system'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: newTheme;
	document.documentElement.setAttribute('data-theme', resolved);
	// The installed app's title bar matches the navbar below it
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute('content', THEME_COLORS[resolved]);
}

export function setTheme(newTheme: Theme) {
	if (!browser) return;
	localStorage.setItem('theme', newTheme);
	theme = newTheme;
	setThemeInHTML(newTheme);
}

export function updateTheme() {
	if (!browser) return;
	const storedTheme = localStorage.getItem('theme') as Theme | 'undefined';
	if (storedTheme === 'undefined' || !storedTheme) {
		localStorage.setItem('theme', 'system');
		theme = 'system';
	} else {
		theme = storedTheme;
	}
}

export function getTheme(): Theme {
	updateTheme();
	return theme;
}

export function toggleTheme() {
	const themes = ['system', 'light', 'dark'] as const;
	const currentTheme = getTheme();
	const currentIndex = themes.indexOf(currentTheme);
	const nextIndex = (currentIndex + 1) % themes.length;
	const nextTheme = themes[nextIndex];
	setTheme(nextTheme);
}
