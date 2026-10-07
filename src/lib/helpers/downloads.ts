// Desktop app downloads, served from the GitHub releases of this repository.
// The installers carry the version in their file name, so the server looks up
// the latest release and /download/[platform] redirects to the matching asset.

const REPO_URL = 'https://github.com/DeutscheModelUnitedNations/munify-chase';

export const RELEASES_API_URL =
	'https://api.github.com/repos/DeutscheModelUnitedNations/munify-chase/releases/latest';
export const RELEASES_PAGE_URL = `${REPO_URL}/releases/latest`;
export const INSTALL_GUIDE_URL = `${REPO_URL}/blob/native-client/docs/INSTALL.md`;
export const ARCH_BUILD_URL = `${REPO_URL}/tree/native-client/aur/munify-chase-bin`;

const PLATFORM_ASSETS = {
	windows: { os: 'Windows', format: '.exe', icon: 'fa-windows', pattern: /-setup\.exe$/ },
	macos: { os: 'macOS', format: '.dmg', icon: 'fa-apple', pattern: /\.dmg$/ },
	'linux-appimage': { os: 'Linux', format: '.AppImage', icon: 'fa-linux', pattern: /\.AppImage$/ },
	'linux-deb': { os: 'Linux', format: '.deb', icon: 'fa-linux', pattern: /\.deb$/ },
	'linux-rpm': { os: 'Linux', format: '.rpm', icon: 'fa-linux', pattern: /\.rpm$/ }
} as const;

export type DownloadPlatform = keyof typeof PLATFORM_ASSETS;

export const DOWNLOAD_PLATFORMS = Object.keys(PLATFORM_ASSETS) as DownloadPlatform[];

export const isDownloadPlatform = (value: string): value is DownloadPlatform =>
	Object.hasOwn(PLATFORM_ASSETS, value);

export const platformLabel = (platform: DownloadPlatform) => PLATFORM_ASSETS[platform];

export interface ReleaseAsset {
	url: string;
	size: number;
}

export interface LatestRelease {
	version: string;
	assets: Partial<Record<DownloadPlatform, ReleaseAsset>>;
}

/** Picks the installer for each platform from a release's asset list. */
export function pickInstallers(
	assets: { name: string; browser_download_url: string; size: number }[]
): LatestRelease['assets'] {
	const installers: LatestRelease['assets'] = {};
	for (const platform of DOWNLOAD_PLATFORMS) {
		const asset = assets.find((a) => PLATFORM_ASSETS[platform].pattern.test(a.name));
		if (asset) installers[platform] = { url: asset.browser_download_url, size: asset.size };
	}
	return installers;
}

/**
 * Guesses the visitor's desktop platform from the User-Agent. Phones and
 * tablets get null, there is no installer for them. iPads report a desktop
 * Safari UA and are indistinguishable from Macs here.
 */
export function detectPlatform(userAgent: string | null): DownloadPlatform | null {
	if (!userAgent || /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)) return null;
	if (/Windows/i.test(userAgent)) return 'windows';
	if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macos';
	if (/Fedora|Red Hat/i.test(userAgent)) return 'linux-rpm';
	if (/Ubuntu|Debian/i.test(userAgent)) return 'linux-deb';
	if (/Linux|X11/i.test(userAgent)) return 'linux-appimage';
	return null;
}
