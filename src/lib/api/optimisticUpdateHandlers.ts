import { gql } from '@urql/core';
import type { OptimisticMutationConfig, UpdatesConfig } from '@urql/exchange-graphcache';

export const optimistic: OptimisticMutationConfig = {
	updateSpeakersList: (args) => {
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
	updateCommittee: (args) => {
		const result: Record<string, unknown> = {
			__typename: 'Committee',
			id: args.id
		};
		for (const field of [
			'abbreviation',
			'activeAgendaItemId',
			'allowDelegationsToAddThemselvesToSpeakersList',
			'name',
			'showWhiteboard',
			'stateOfDebate',
			'status',
			'statusHeadline',
			'statusUntil',
			'whiteboardContent'
		]) {
			if ((args as Record<string, unknown>)[field] !== undefined) {
				result[field] = (args as Record<string, unknown>)[field];
			}
		}
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
		})),
	addSpeakerOnList: (args, cache) => {
		const list = cache.readFragment(
			gql`
				fragment AddSpeakerOptimisticList on Speakerslist {
					id
					speakers {
						id
						position
					}
				}
			`,
			{ __typename: 'Speakerslist', id: args.speakersListId } as Record<string, unknown>
		);
		if (!list) return null;

		const speakers = list.speakers as Array<{ id: string; position: number }>;
		const position = typeof args.position === 'number' ? args.position : speakers.length;

		let committeeMember = null;
		if (args.committeeMemberId) {
			committeeMember = cache.readFragment(
				gql`
					fragment AddSpeakerOptimisticCM on Committeemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Committeemember', id: args.committeeMemberId } as Record<string, unknown>
			);
		}

		let conferenceMember = null;
		if (args.conferenceMemberId) {
			conferenceMember = cache.readFragment(
				gql`
					fragment AddSpeakerOptimisticConM on Conferencemember {
						id
						representation {
							id
							name
							alpha2Code
							alpha3Code
							faIcon
							type
						}
					}
				`,
				{ __typename: 'Conferencemember', id: args.conferenceMemberId } as Record<string, unknown>
			);
		}

		return {
			__typename: 'Speakeronlist',
			id: `__optimistic__${Date.now()}`,
			position,
			speakersListId: args.speakersListId,
			overwriteName: null,
			committeeMember: committeeMember ?? null,
			conferenceMember: conferenceMember ?? null
		};
	}
};

const addSpeakerListFragment = gql`
	fragment AddSpeakerUpdateList on Speakerslist {
		id
		speakers {
			id
			position
		}
	}
`;

export const updates: UpdatesConfig = {
	Mutation: {
		addSpeakerOnList: (result, args, cache) => {
			const newSpeaker = (result as Record<string, Record<string, unknown>>).addSpeakerOnList;
			if (!newSpeaker?.id) return;

			const list = cache.readFragment(addSpeakerListFragment, {
				__typename: 'Speakerslist',
				id: args.speakersListId
			} as Record<string, unknown>) as {
				speakers: Array<{ id: string; position: number }>;
			} | null;
			if (!list) return;

			if (list.speakers.some((s) => s.id === newSpeaker.id)) return;

			const position =
				typeof newSpeaker.position === 'number' ? newSpeaker.position : list.speakers.length;

			cache.writeFragment(addSpeakerListFragment, {
				__typename: 'Speakerslist',
				id: args.speakersListId,
				speakers: [...list.speakers, { __typename: 'Speakeronlist', id: newSpeaker.id, position }]
			});
		}
	}
};
