import { graphql } from '$houdini';
import type { CommitteePresentationQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query CommitteePresentationQuery($committeeId: ID!) {
		findFirstCommittee(where: { id: $committeeId }) {
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

export const _CommitteePresentationQueryVariables: CommitteePresentationQueryVariables = (
	event
) => {
	return {
		committeeId: event.params.committeeId
	};
};
