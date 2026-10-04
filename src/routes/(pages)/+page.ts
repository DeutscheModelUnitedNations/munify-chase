import type { PageLoad } from './$types';

// Number of hero illustrations and background polygons in LandingHero.svelte
const HERO_ILLUSTRATIONS = 3;
const HERO_SHAPES = 5;

// Picked once per visit so every visit gets a new combination
export const load: PageLoad = () => ({
	hero: {
		illustration: Math.floor(Math.random() * HERO_ILLUSTRATIONS),
		shape: Math.floor(Math.random() * HERO_SHAPES)
	}
});
