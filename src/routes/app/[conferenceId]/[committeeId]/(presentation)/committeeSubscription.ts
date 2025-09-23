import { graphql } from '$houdini';

export const PresentationSubscription = graphql(`
	subscription PresentationSubscription($id: ID!) {
		findFirstCommittee(where: { id: $id }) {
			id
			abbreviation
			name
			status
			statusHeadline
			statusUntil
			totalPresent
			simpleMajority
			twoThirdsMajority
			paperSupportThreshold
			lastResolutionAdoptionDate
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
			whiteboardContent
			members {
				id
				present
				representation {
					id
					type
					name
					alpha2Code
					alpha3Code
					regionalGroup
					faIcon
				}
			}
			conference {
				uniqueConferenceMembers {
					id
					representation {
						id
						type
						name
						alpha2Code
						alpha3Code
						faIcon
					}
				}
			}
		}
	}
`);
