import { graphql } from '$houdini';
import type { ParticipantCommitteeQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantCommitteeQuery($committeeId: ID!) {
		findFirstCommittee(where: { id: $committeeId }) {
			id
			abbreviation
			name
			status
			statusHeadline
			statusUntil
			showWhiteboard
			whiteboardContent
			allowDelegationsToAddThemselvesToSpeakersList
			totalPresent
			simpleMajority
			twoThirdsMajority
			paperSupportThreshold
			activeAgendaItem {
				id
				title
				speakersList {
					id
					type
					isClosed
					speakingTime
					startTimestamp
					timeLeft
					speakers {
						id
						position
						overwriteName
						committeeMember {
							id
							representation {
								id
								type
								name
								regionalGroup
								alpha2Code
								alpha3Code
								faIcon
							}
							present
						}
						conferenceMember {
							id
							representation {
								id
								type
								name
								regionalGroup
								alpha2Code
								alpha3Code
								faIcon
							}
						}
					}
				}
			}
			members {
				id
				present
				representation {
					id
					type
					name
					alpha2Code
					faIcon
				}
			}
		}
	}
`);

export const _ParticipantCommitteeQueryVariables: ParticipantCommitteeQueryVariables = (event) => {
	return {
		committeeId: event.params.committeeId
	};
};
