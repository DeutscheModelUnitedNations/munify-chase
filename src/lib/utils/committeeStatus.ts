import type { CommitteestatusEnum } from '#lib/api/rumbleClient/client';
import * as m from '#lib/paraglide/messages';

const STATUS_DISPLAY: Record<
	CommitteestatusEnum,
	{ text: () => string; icon: string; background: string }
> = {
	FORMAL: { text: () => m.formalDebate(), icon: 'lectern', background: 'bg-base-200' },
	INFORMAL: { text: () => m.informalCaucus(), icon: 'chats', background: 'bg-error' },
	MODERATED_INFORMAL: {
		text: () => m.moderatedInformalCaucus(),
		icon: 'chats-circle',
		background: 'bg-error'
	},
	PAUSE: { text: () => m.pause(), icon: 'coffee', background: 'bg-warning' },
	SUSPENSION: { text: () => m.suspension(), icon: 'skip-forward', background: 'bg-info' }
};

/** Unknown statuses (a newer server) render neutral rather than throwing */
const displayOf = (category: CommitteestatusEnum) =>
	Object.hasOwn(STATUS_DISPLAY, category) ? STATUS_DISPLAY[category] : undefined;

export function getCommitteeStatusText(
	category: CommitteestatusEnum,
	overwriteText?: string
): string {
	if (overwriteText) return overwriteText;
	return displayOf(category)?.text() ?? '';
}

export function getCommitteeStatusIcon(category: CommitteestatusEnum) {
	return displayOf(category)?.icon ?? 'question';
}

export function getCommitteeStatusBackground(category: CommitteestatusEnum) {
	return displayOf(category)?.background;
}
