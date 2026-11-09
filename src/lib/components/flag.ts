import { Alpha3 } from 'convert-iso-codes';

export interface FlagRepresentation {
	type?: string | null;
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	icon?: string | null;
	regionalGroup?: string | null;
}

/** The lowercase alpha-2 code `flag-icons` draws for a representation, `un` for the UN */
export function flagCountryCode(representation: FlagRepresentation | null | undefined) {
	if (representation?.type === 'UN') return 'un';
	if (representation?.alpha2Code) return representation.alpha2Code.toLowerCase();
	if (representation?.alpha3Code) return Alpha3.toAlpha2(representation.alpha3Code)?.toLowerCase();
	return null;
}

const TYPE_CLASSES: Record<string, string> = {
	NSA: 'bg-error text-error-content',
	DELEGATION: 'text-base-content bg-[#bea162]'
};

/** The colours of a flag card: by representation type, dimmed as a placeholder */
export function flagCardClass({
	type,
	placeholder
}: {
	type: string | null | undefined;
	placeholder: boolean;
}) {
	const typeClass = (type && Object.hasOwn(TYPE_CLASSES, type) && TYPE_CLASSES[type]) || '';
	return placeholder ? `${typeClass} bg-base-200 text-base-content opacity-50` : typeClass;
}

/**
 * A representation with something to draw (a country code or an icon) as it is,
 * anything else as the UN.
 */
export function representationOrUn<R extends FlagRepresentation>(
	representation: R | null | undefined
): R | { type: 'UN' } {
	if (representation?.alpha3Code || representation?.alpha2Code || representation?.icon) {
		return representation;
	}
	return { type: 'UN' };
}
