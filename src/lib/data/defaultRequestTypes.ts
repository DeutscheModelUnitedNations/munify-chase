import * as m from '$lib/paraglide/messages';

/**
 * Default set of request types, based on DMUN's "Antragsübersicht" (request
 * overview) reference sheet. Order matches the sheet's natural hierarchy -
 * personal rights first, then procedural motions - which becomes the
 * `priority` ordering when loaded (requestType.priority is assigned by
 * insertion order, see createRequestType).
 */
export type DefaultRequestType = {
	name: string;
	faIcon: string;
};

export function getDefaultRequestTypes(): DefaultRequestType[] {
	return [
		// Personal requests
		{ name: m.requestTypeRightToInformation(), faIcon: 'fa-circle-info' },
		{ name: m.requestTypeRestoreOrder(), faIcon: 'fa-gavel' },
		{ name: m.requestTypeClarifyMisunderstanding(), faIcon: 'fa-circle-question' },
		// Motions regarding the rules of procedure
		{ name: m.requestTypeRollCallVote(), faIcon: 'fa-bullhorn' },
		{ name: m.requestTypeAppealChairDecision(), faIcon: 'fa-scale-balanced' },
		{ name: m.requestTypeInformalSession(), faIcon: 'fa-comments' },
		{ name: m.requestTypeNewAgendaItem(), faIcon: 'fa-list-check' },
		{ name: m.requestTypeReturnDraftResolution(), faIcon: 'fa-rotate-left' },
		{ name: m.requestTypePostponeAgendaItem(), faIcon: 'fa-clock-rotate-left' },
		{ name: m.requestTypeReturnGeneralDebate(), faIcon: 'fa-arrows-rotate' },
		{ name: m.requestTypeEndDebate(), faIcon: 'fa-flag-checkered' },
		{ name: m.requestTypeImmediateVote(), faIcon: 'fa-square-poll-vertical' },
		{ name: m.requestTypeCloseReopenSpeakersList(), faIcon: 'fa-list-ol' },
		{ name: m.requestTypeChangeSpeakingTime(), faIcon: 'fa-stopwatch' },
		{ name: m.requestTypeGuestSpeech(), faIcon: 'fa-user-tie' }
	];
}
