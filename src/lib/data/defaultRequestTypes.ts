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
	// Per DMUN's reference sheet, only personal rights, roll-call votes and
	// informal sessions are open to NSAs - the rest of the procedural motions
	// are delegate-only.
	delegatesOnly: boolean;
};

export function getDefaultRequestTypes(): DefaultRequestType[] {
	return [
		// Personal requests
		{ name: m.requestTypeRightToInformation(), faIcon: 'fa-circle-info', delegatesOnly: false },
		{ name: m.requestTypeRestoreOrder(), faIcon: 'fa-gavel', delegatesOnly: false },
		{
			name: m.requestTypeClarifyMisunderstanding(),
			faIcon: 'fa-circle-question',
			delegatesOnly: false
		},
		// Motions regarding the rules of procedure
		{ name: m.requestTypeRollCallVote(), faIcon: 'fa-bullhorn', delegatesOnly: false },
		{ name: m.requestTypeAppealChairDecision(), faIcon: 'fa-scale-balanced', delegatesOnly: true },
		{ name: m.requestTypeInformalSession(), faIcon: 'fa-comments', delegatesOnly: false },
		{ name: m.requestTypeNewAgendaItem(), faIcon: 'fa-list-check', delegatesOnly: true },
		{ name: m.requestTypeReturnDraftResolution(), faIcon: 'fa-rotate-left', delegatesOnly: true },
		{
			name: m.requestTypePostponeAgendaItem(),
			faIcon: 'fa-clock-rotate-left',
			delegatesOnly: true
		},
		{ name: m.requestTypeReturnGeneralDebate(), faIcon: 'fa-arrows-rotate', delegatesOnly: true },
		{ name: m.requestTypeEndDebate(), faIcon: 'fa-flag-checkered', delegatesOnly: true },
		{
			name: m.requestTypeImmediateVote(),
			faIcon: 'fa-square-poll-vertical',
			delegatesOnly: true
		},
		{ name: m.requestTypeCloseReopenSpeakersList(), faIcon: 'fa-list-ol', delegatesOnly: true },
		{ name: m.requestTypeChangeSpeakingTime(), faIcon: 'fa-stopwatch', delegatesOnly: true },
		{ name: m.requestTypeGuestSpeech(), faIcon: 'fa-user-tie', delegatesOnly: true }
	];
}
