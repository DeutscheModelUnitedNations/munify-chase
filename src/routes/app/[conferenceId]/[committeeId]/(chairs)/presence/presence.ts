import { m } from '#lib/paraglide/messages';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

type Representation = { name?: string | null; alpha3Code?: string | null } | null | undefined;

/** A delegation's name: its own, else its country's, else unknown */
export function delegationName(rep: Representation): string {
	if (!rep || !(rep.name || rep.alpha3Code)) return m.unknown();
	return rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code);
}

/** The globe icon and colour a regional group shows as, none for a group we don't know */
const REGIONAL_GROUP_ICONS: Record<string, string> = {
	AFRICA: 'ph-globe-hemisphere-east text-blue-500',
	ASIA_PACIFIC: 'ph-globe-hemisphere-east text-green-500',
	EASTERN_EUROPE: 'ph-globe-hemisphere-east text-red-500',
	LATIN_AMERICA_CARIBBEAN: 'ph-globe-hemisphere-west text-pink-500',
	WESTERN_EUROPE_OTHERS: 'ph-globe-hemisphere-east text-yellow-500'
};

export function regionalGroupIcon(group: string): string | undefined {
	return Object.hasOwn(REGIONAL_GROUP_ICONS, group) ? REGIONAL_GROUP_ICONS[group] : undefined;
}

/** How many of a past roll call's members were present, out of how many were called */
export function rollCallTally(events: { present: boolean }[]) {
	return { present: events.filter((e) => e.present).length, total: events.length };
}
