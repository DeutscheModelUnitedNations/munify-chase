import { describe, expect, it } from 'vitest';
import { detectPlatform, isDownloadPlatform, pickInstallers } from './downloads';

// Asset names as attached to the v3.1.1 release
const ASSETS = [
	'latest.json',
	'munify-chase-3.1.1-1.x86_64.rpm',
	'munify-chase-3.1.1-1.x86_64.rpm.sig',
	'munify-chase_3.1.1_amd64.AppImage',
	'munify-chase_3.1.1_amd64.AppImage.sig',
	'munify-chase_3.1.1_amd64.deb',
	'munify-chase_3.1.1_amd64.deb.sig',
	'munify-chase_3.1.1_universal.dmg',
	'munify-chase_3.1.1_x64-setup.exe',
	'munify-chase_3.1.1_x64-setup.exe.sig'
].map((name) => ({ name, browser_download_url: `https://example.com/${name}`, size: 1 }));

describe('pickInstallers', () => {
	it('maps every platform to its installer and skips signatures', () => {
		const installers = pickInstallers(ASSETS);
		expect(Object.fromEntries(Object.entries(installers).map(([k, v]) => [k, v.url]))).toEqual({
			windows: 'https://example.com/munify-chase_3.1.1_x64-setup.exe',
			macos: 'https://example.com/munify-chase_3.1.1_universal.dmg',
			'linux-appimage': 'https://example.com/munify-chase_3.1.1_amd64.AppImage',
			'linux-deb': 'https://example.com/munify-chase_3.1.1_amd64.deb',
			'linux-rpm': 'https://example.com/munify-chase-3.1.1-1.x86_64.rpm'
		});
	});

	it('leaves out platforms whose installer is not attached yet', () => {
		expect(pickInstallers(ASSETS.filter((a) => !a.name.endsWith('.dmg')))).not.toHaveProperty(
			'macos'
		);
		expect(pickInstallers([])).toEqual({});
	});
});

describe('detectPlatform', () => {
	it.each([
		['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0', 'windows'],
		['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605', 'macos'],
		['Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0', 'linux-deb'],
		['Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0', 'linux-rpm'],
		['Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0', 'linux-appimage'],
		['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36', null],
		['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15', null],
		['curl/8.5.0', null]
	])('%s → %s', (ua, expected) => {
		expect(detectPlatform(ua)).toBe(expected);
	});

	it('handles a missing User-Agent', () => {
		expect(detectPlatform(null)).toBeNull();
	});
});

it('only accepts known platforms', () => {
	expect(isDownloadPlatform('windows')).toBe(true);
	expect(isDownloadPlatform('toString')).toBe(false);
	expect(isDownloadPlatform('ios')).toBe(false);
});
