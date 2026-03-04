import { graphql } from '$houdini';

export const ParticipantCommitteeSubscription = graphql(`
	subscription ParticipantCommitteeSubscription($id: ID!) {
		findFirstCommittee(where: { id: $id }) {
			id
			abbreviation
			name
			status
			statusHeadline
			statusUntil
			showWhiteboard
			whiteboardContent
			allowDelegationsToAddThemselvesToSpeakersList
			supportReEvaluationOpen
			activeDraftResolutionId
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
