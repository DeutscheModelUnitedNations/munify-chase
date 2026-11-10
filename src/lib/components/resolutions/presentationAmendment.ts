import { m } from '#lib/paraglide/messages';

const AMENDMENT_TYPES: Record<string, { label: () => string; badge: string }> = {
	DELETE: { label: m.deleteClausePresentation, badge: 'badge-error' },
	ALTER_TEXT: { label: m.alterClausePresentation, badge: 'badge-warning' },
	ADD: { label: m.addClausePresentation, badge: 'bg-green-700 text-white border-0' },
	ALTER_POSITION: { label: m.moveClausePresentation, badge: 'badge-info' }
};

/** How the presentation names and colours an amendment type. */
export function presentationAmendmentType(type: string): { label: string; badge: string } {
	const known = AMENDMENT_TYPES[type];
	return known
		? { label: known.label(), badge: known.badge }
		: { label: type, badge: 'badge-ghost' };
}

/**
 * The index of the operative clause an amendment targets: by clause id while
 * that clause exists, else by the index it was proposed for; -1 for none.
 */
export function amendmentClauseIndex({
	amendment,
	operative
}: {
	amendment: { targetClauseId?: string | null; targetOperativeIndex?: number | null } | null;
	operative: readonly { id: string }[] | undefined;
}): number {
	if (!amendment || !operative) return -1;
	const byId = amendment.targetClauseId
		? operative.findIndex((c) => c.id === amendment.targetClauseId)
		: -1;
	return byId === -1 ? (amendment.targetOperativeIndex ?? -1) : byId;
}
