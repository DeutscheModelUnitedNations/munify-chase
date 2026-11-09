import type { RegionalgroupEnum } from '#lib/api/rumbleClient/client';
import { m } from '#lib/paraglide/messages';

const REGIONAL_GROUP_NAMES: Record<RegionalgroupEnum, () => string> = {
	AFRICA: () => m.regionalGroup_africa(),
	ASIA_PACIFIC: () => m.regionalGroup_asiaPacific(),
	EASTERN_EUROPE: () => m.regionalGroup_easternEurope(),
	LATIN_AMERICA_CARIBBEAN: () => m.regionalGroup_latinAmericaCaribbean(),
	WESTERN_EUROPE_OTHERS: () => m.regionalGroup_westernEuropeOthers()
};

export function translateRegionalGroupEnum(regionalGroup?: RegionalgroupEnum) {
	if (!regionalGroup) return '';
	return REGIONAL_GROUP_NAMES[regionalGroup]?.();
}
