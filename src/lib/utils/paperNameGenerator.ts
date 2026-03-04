import { getLocale } from '$lib/paraglide/runtime';

const adverbs = {
	en: [
		'Very',
		'Super',
		'Ultra',
		'Quite',
		'Totally',
		'Absolutely',
		'Fairly',
		'Really',
		'Extremely',
		'Incredibly',
		'Remarkably',
		'Exceptionally',
		'Tremendously',
		'Hugely',
		'Fantastically'
	],
	de: [
		'Sehr',
		'Super',
		'Ultra',
		'Ziemlich',
		'Total',
		'Absolut',
		'Recht',
		'Wirklich',
		'Extrem',
		'Unglaublich',
		'Bemerkenswert',
		'Außergewöhnlich',
		'Enorm',
		'Riesig',
		'Fantastisch'
	]
};

const adjectives = {
	en: [
		'Happy',
		'Calm',
		'Excited',
		'Energetic',
		'Hopeful',
		'Content',
		'Curious',
		'Motivated',
		'Cheerful',
		'Determined',
		'Confident',
		'Magnificent',
		'Grand',
		'Majestic',
		'Splendid',
		'Glorious',
		'Noble',
		'Dignified',
		'Optimistic'
	],
	de: [
		'Fröhlicher',
		'Ruhiger',
		'Begeisterter',
		'Energischer',
		'Hoffnungsvoller',
		'Zufriedener',
		'Neugieriger',
		'Motivierter',
		'Heiterer',
		'Entschlossener',
		'Selbstbewusster',
		'Großartiger',
		'Grandioser',
		'Majestätischer',
		'Prächtiger',
		'Glorreicher',
		'Edler',
		'Würdevoller',
		'Optimistischer'
	]
};

const unSecretaryGenerals = [
	'Trygve Lie',
	'Dag Hammarskjöld',
	'U Thant',
	'Kurt Waldheim',
	'Javier Pérez de Cuéllar',
	'Boutros Boutros-Ghali',
	'Kofi Annan',
	'Ban Ki-moon',
	'António Guterres'
];

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePaperName(): string {
	const locale = getLocale() as 'en' | 'de';
	const adverbList = adverbs[locale] ?? adverbs.en;
	const adjectiveList = adjectives[locale] ?? adjectives.en;

	return `${pick(adverbList)} ${pick(adjectiveList)} ${pick(unSecretaryGenerals)}`;
}
