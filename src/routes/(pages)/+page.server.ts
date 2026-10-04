import type { PageServerLoad } from './$types';

// Number of hero illustrations and background polygons in LandingHero.svelte
const HERO_ILLUSTRATIONS = 3;
const HERO_SHAPES = 5;

// Picked on the server so every visit gets a new combination, while the
// hydrating client renders the same one instead of swapping it.
export const load: PageServerLoad = () => ({
	hero: {
		illustration: Math.floor(Math.random() * HERO_ILLUSTRATIONS),
		shape: Math.floor(Math.random() * HERO_SHAPES)
	}
});
