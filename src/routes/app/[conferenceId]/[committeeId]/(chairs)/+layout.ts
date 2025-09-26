import { graphql } from '$houdini';
import type { CommitteeTeamQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query CommitteeTeamQuery($committeeId: ID!) {
		findFirstCommittee(where: { id: $committeeId }) {
			id
			abbreviation
			name
			stateOfDebate
			status
			statusHeadline
			statusUntil
			totalPresent
			simpleMajority
			twoThirdsMajority
			paperSupportThreshold
			whiteboardContent
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
			agendaItems {
				id
				title
			}
			members {
				id
				present
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
			conference {
				hasModeratedCaucus
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

export const _CommitteeTeamQueryVariables: CommitteeTeamQueryVariables = (event) => {
	return {
		committeeId: event.params.committeeId
	};
};
