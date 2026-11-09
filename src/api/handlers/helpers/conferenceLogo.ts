import { GraphQLError } from 'graphql';

const MAX_LOGO_LENGTH = 512 * 1024;

/**
 * The logo column a conference update writes. An empty string removes the logo (stored as null),
 * anything else must look like an SVG and is stored verbatim; left out keeps the logo.
 */
export function logoSvgUpdate(logoSvg: string | null | undefined): { logoSvg?: string | null } {
	if (logoSvg === undefined || logoSvg === null) return {};
	const trimmed = logoSvg.trim();
	if (trimmed === '') return { logoSvg: null };
	if (!trimmed.includes('<svg') || logoSvg.length > MAX_LOGO_LENGTH) {
		throw new GraphQLError('Invalid SVG logo');
	}
	return { logoSvg };
}
