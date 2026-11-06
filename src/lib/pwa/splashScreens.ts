/**
 * The launch images iOS shows while the installed app starts (`static/pwa/splash/`). iOS takes
 * only an image of the device's exact size, chosen by media query, so there is one per screen; a
 * device missing here starts on a blank screen. The root layout links them. Same list as in DELEGATOR.
 */

/** A screen in CSS pixels, portrait, and its pixel ratio */
type Screen = { width: number; height: number; ratio: number; tablet?: true };

const SCREENS: Screen[] = [
	// iPhones
	{ width: 440, height: 956, ratio: 3 }, // 16/17 Pro Max
	{ width: 430, height: 932, ratio: 3 }, // 14 Pro Max, 15/16 Plus, 15 Pro Max
	{ width: 428, height: 926, ratio: 3 }, // 12/13 Pro Max, 14 Plus
	{ width: 420, height: 912, ratio: 3 }, // Air
	{ width: 414, height: 896, ratio: 3 }, // XS Max, 11 Pro Max
	{ width: 414, height: 896, ratio: 2 }, // XR, 11
	{ width: 414, height: 736, ratio: 3 }, // 6/7/8 Plus
	{ width: 402, height: 874, ratio: 3 }, // 16/17 Pro, 17
	{ width: 393, height: 852, ratio: 3 }, // 14 Pro, 15, 15 Pro, 16
	{ width: 390, height: 844, ratio: 3 }, // 12, 13, 14, 16e
	{ width: 375, height: 812, ratio: 3 }, // X, XS, 11 Pro, 12/13 mini
	{ width: 375, height: 667, ratio: 2 }, // 6/7/8, SE 2/3
	{ width: 320, height: 568, ratio: 2 }, // SE
	// iPads
	{ width: 1032, height: 1376, ratio: 2, tablet: true }, // Pro 13"
	{ width: 1024, height: 1366, ratio: 2, tablet: true }, // Pro 12.9"
	{ width: 834, height: 1210, ratio: 2, tablet: true }, // Pro 11" (M4)
	{ width: 834, height: 1194, ratio: 2, tablet: true }, // Pro 11"
	{ width: 820, height: 1180, ratio: 2, tablet: true }, // Air 10.9", 10th gen
	{ width: 834, height: 1112, ratio: 2, tablet: true }, // Air 10.5"
	{ width: 810, height: 1080, ratio: 2, tablet: true }, // 10.2"
	{ width: 768, height: 1024, ratio: 2, tablet: true }, // 9.7", mini 5
	{ width: 744, height: 1133, ratio: 2, tablet: true } // mini 6
];

function splash({ screen, landscape }: { screen: Screen; landscape: boolean }) {
	const width = (landscape ? screen.height : screen.width) * screen.ratio;
	const height = (landscape ? screen.width : screen.height) * screen.ratio;
	return {
		file: `pwa/splash/${width}x${height}.png`,
		media:
			`(device-width: ${screen.width}px) and (device-height: ${screen.height}px) and ` +
			`(-webkit-device-pixel-ratio: ${screen.ratio}) and ` +
			`(orientation: ${landscape ? 'landscape' : 'portrait'})`
	};
}

/** iPhones only in portrait, iPads in both orientations */
export const SPLASH_SCREENS = SCREENS.flatMap((screen) => [
	splash({ screen, landscape: false }),
	...(screen.tablet ? [splash({ screen, landscape: true })] : [])
]);
