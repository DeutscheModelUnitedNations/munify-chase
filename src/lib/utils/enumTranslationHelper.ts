import type { RegionalgroupEnum } from '$lib/api/rumbleClient/client';
import { m } from '$lib/paraglide/messages';

export function translateRegionalGroupEnum(regionalGroup?: RegionalgroupEnum) {
  if (!regionalGroup) return '';
  switch (regionalGroup) {
    case 'AFRICA':
      return m.regionalGroup_africa();
    case 'ASIA_PACIFIC':
      return m.regionalGroup_asiaPacific();
    case 'EASTERN_EUROPE':
      return m.regionalGroup_easternEurope();
    case 'LATIN_AMERICA_CARIBBEAN':
      return m.regionalGroup_latinAmericaCaribbean();
    case 'WESTERN_EUROPE_OTHERS':
      return m.regionalGroup_westernEuropeOthers();
  }
}
