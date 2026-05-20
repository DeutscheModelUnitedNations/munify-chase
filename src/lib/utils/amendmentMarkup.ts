import {
	parseClauseFragment,
	serializeClause
} from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type { OperativeClause } from '@deutschemodelunitednations/munify-resolution-editor';

/**
 * Parse a stored RES-Markup amendment fragment back into an `OperativeClause`.
 * Returns `null` for non-strings, blank markup, or unparseable input so
 * callers can fall back gracefully.
 */
export function markupToClause(markup: unknown): OperativeClause | null {
	if (typeof markup !== 'string' || markup.trim() === '') return null;
	const p = parseClauseFragment(markup);
	return p.valid ? p.clause : null;
}

export { serializeClause };
