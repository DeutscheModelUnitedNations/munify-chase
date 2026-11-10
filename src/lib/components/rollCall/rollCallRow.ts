import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

/** The mark next to a roll call row: saving, a custom icon, absent, present, or none yet */
export type RollCallMark = 'pending' | 'icon' | 'absent' | 'present' | null;

export function rollCallMark({
	present,
	pending,
	hasIcon,
	called
}: {
	present: boolean;
	pending: boolean;
	hasIcon: boolean;
	/** Whether the roll call has passed this row */
	called: boolean;
}): RollCallMark {
	if (pending) return 'pending';
	if (!called) return null;
	if (hasIcon) return 'icon';
	return present ? 'present' : 'absent';
}

/** A representation's name, the country's name from its code, or null when it has neither */
export function representationName(
	rep: { name?: string | null; alpha3Code?: string | null } | null | undefined
): string | null {
	if (!rep || !(rep.name || rep.alpha3Code)) return null;
	return rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code);
}
