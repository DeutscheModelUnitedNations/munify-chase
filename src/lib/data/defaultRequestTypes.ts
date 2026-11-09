import * as m from '#lib/paraglide/messages';

/**
 * Default set of request types, based on DMUN's "Antragsübersicht" (request
 * overview) reference sheet. Order matches the sheet's natural hierarchy -
 * personal rights first, then procedural motions - which becomes the
 * `priority` ordering when loaded (requestType.priority is assigned by
 * insertion order, see createRequestType).
 */
export type DefaultRequestType = {
	name: string;
	icon: string;
	// Per DMUN's reference sheet, only personal rights, roll-call votes and
	// informal sessions are open to NSAs - the rest of the procedural motions
	// are delegate-only.
	delegatesOnly: boolean;
};

export function getDefaultRequestTypes(): DefaultRequestType[] {
	return [
		// Personal requests
		{ name: m.requestTypeRightToInformation(), icon: 'info', delegatesOnly: false },
		{ name: m.requestTypeRestoreOrder(), icon: 'gavel', delegatesOnly: false },
		{
			name: m.requestTypeClarifyMisunderstanding(),
			icon: 'question',
			delegatesOnly: false
		},
		// Motions regarding the rules of procedure
		{ name: m.requestTypeRollCallVote(), icon: 'megaphone', delegatesOnly: false },
		{ name: m.requestTypeAppealChairDecision(), icon: 'scales', delegatesOnly: true },
		{ name: m.requestTypeInformalSession(), icon: 'chats', delegatesOnly: false },
		{ name: m.requestTypeNewAgendaItem(), icon: 'list-checks', delegatesOnly: true },
		{
			name: m.requestTypeReturnDraftResolution(),
			icon: 'arrow-counter-clockwise',
			delegatesOnly: true
		},
		{
			name: m.requestTypePostponeAgendaItem(),
			icon: 'clock-counter-clockwise',
			delegatesOnly: true
		},
		{ name: m.requestTypeReturnGeneralDebate(), icon: 'arrows-clockwise', delegatesOnly: true },
		{ name: m.requestTypeEndDebate(), icon: 'flag-checkered', delegatesOnly: true },
		{
			name: m.requestTypeImmediateVote(),
			icon: 'chart-bar',
			delegatesOnly: true
		},
		{ name: m.requestTypeCloseReopenSpeakersList(), icon: 'list-numbers', delegatesOnly: true },
		{ name: m.requestTypeChangeSpeakingTime(), icon: 'timer', delegatesOnly: true },
		{ name: m.requestTypeGuestSpeech(), icon: 'user-sound', delegatesOnly: true }
	];
}
