import { gql } from '@urql/core';
import type { OptimisticMutationConfig } from '@urql/exchange-graphcache';

export const optimistic: OptimisticMutationConfig = {
	updateSpeakersList: (args, cache, info) => {
		const result: Record<string, unknown> = {
			__typename: 'Speakerslist',
			id: args.id
		};
		if (args.isClosed != null) result.isClosed = args.isClosed;
		if (args.speakingTime != null) result.speakingTime = args.speakingTime;
		if (args.timeLeft != null) result.timeLeft = args.timeLeft;
		if (args.stopTimer) result.startTimestamp = null;
		else if (args.startTimestamp !== undefined) result.startTimestamp = args.startTimestamp;
		return result;
	},
	updateCommittee: (args, cache, info) => {
		const result: Record<string, unknown> = {
			__typename: 'Committee',
			id: args.id
		};
		for (const field of [
			'abbreviation',
			'activeAgendaItemId',
			'allowDelegationsToAddThemselvesToSpeakersList',
			'amendmentSponsoringOpen',
			'amendmentSubmissionOpen',
			'currentOperativeClauseId',
			'currentOperativeIndex',
			'lastResolutionAdoptionDate',
			'maxDraftResolutions',
			'name',
			'showWhiteboard',
			'stateOfDebate',
			'status',
			'statusHeadline',
			'statusUntil',
			'supportReEvaluationOpen',
			'whiteboardContent'
		]) {
			if ((args as Record<string, unknown>)[field] !== undefined) {
				result[field] = (args as Record<string, unknown>)[field];
			}
		}
		if (args.clearActiveAmendment) result.activeAmendmentId = null;
		else if (args.activeAmendmentId !== undefined)
			result.activeAmendmentId = args.activeAmendmentId;
		if (args.clearActiveDraftResolution) result.activeDraftResolutionId = null;
		else if (args.activeDraftResolutionId !== undefined)
			result.activeDraftResolutionId = args.activeDraftResolutionId;
		return result;
	},
	clearSpeakersList: (args) => ({
		__typename: 'Speakerslist',
		id: args.id,
		speakers: []
	}),
	removeSpeakerOnList: (args, cache) => {
		const speakerOnList = cache.readFragment(
			gql`
				fragment RemoveSpeakerSource on Speakeronlist {
					id
					speakersListId
					position
				}
			`,
			{ __typename: 'Speakeronlist', id: args.speakerOnListId } as Record<string, unknown>
		);
		if (!speakerOnList?.speakersListId) return null;

		const list = cache.readFragment(
			gql`
				fragment RemoveSpeakerList on Speakerslist {
					id
					speakers {
						id
						position
					}
				}
			`,
			{ __typename: 'Speakerslist', id: speakerOnList.speakersListId } as Record<string, unknown>
		);
		if (!list) return null;

		const speakers = (list.speakers as Array<{ id: string; position: number }>)
			.filter((s) => s.id !== args.speakerOnListId)
			.map((s, i) => ({ ...s, position: i }));

		return {
			__typename: 'Speakerslist',
			id: speakerOnList.speakersListId,
			speakers
		};
	},
	updateSpeakerOnList: (args) => ({
		__typename: 'Speakeronlist',
		id: args.id,
		overwriteName: args.overwriteName ?? null
	}),
	moveSpeakerToPosition: (args, cache) => {
		const speakerOnList = cache.readFragment(
			gql`
				fragment MoveSpeakerSource on Speakeronlist {
					id
					speakersListId
					position
				}
			`,
			{ __typename: 'Speakeronlist', id: args.id } as Record<string, unknown>
		);
		if (!speakerOnList?.speakersListId) return null;

		const list = cache.readFragment(
			gql`
				fragment MoveSpeakerList on Speakerslist {
					id
					speakers {
						id
						position
					}
				}
			`,
			{ __typename: 'Speakerslist', id: speakerOnList.speakersListId } as Record<string, unknown>
		);
		if (!list) return null;

		const currentPos = speakerOnList.position as number;
		const targetPos = args.position as number;
		const updatedSpeakers = (list.speakers as Array<{ id: string; position: number }>).map((s) => {
			if (s.id === args.id) return { ...s, position: targetPos };
			if (targetPos > currentPos) {
				if (s.position > currentPos && s.position <= targetPos)
					return { ...s, position: s.position - 1 };
			} else {
				if (s.position >= targetPos && s.position < currentPos)
					return { ...s, position: s.position + 1 };
			}
			return s;
		});

		return {
			__typename: 'Speakeronlist',
			id: args.id,
			position: targetPos,
			speakersListId: speakerOnList.speakersListId,
			speakersList: {
				__typename: 'Speakerslist',
				id: speakerOnList.speakersListId,
				speakers: updatedSpeakers
			}
		};
	},
	setPresenceForCommitteeMembers: (args) =>
		(args.ids as string[]).map((id) => ({
			__typename: 'Committeemember',
			id,
			present: args.present
		}))
};
