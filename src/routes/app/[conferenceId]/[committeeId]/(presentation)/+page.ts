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
			activeDraftResolutionId
			currentOperativeIndex
			activeAmendmentId
			activeAmendment {
				id
				type
				status
				documentNumber
				targetClauseId
				targetOperativeIndex
				targetPosition
				newContent
				proposer {
					id
					representation {
						name
						alpha2Code
						alpha3Code
					}
				}
			}
			activeDraftResolution {
				id
				content
				documentNumber
				status
				title
				updatedAt
				agendaItem {
					id
					title
				}
				creator {
					id
					representation {
						name
						alpha2Code
						alpha3Code
					}
				}
				amendments {
					id
					type
					status
					documentNumber
					targetClauseId
					targetOperativeIndex
					targetPosition
					newContent
					proposer {
						id
						representation {
							name
						}
					}
				}
				operativeClauseVotes {
					id
					clauseId
					outcome
				}
				voteResult {
					outcome
					votesFor
					votesAgainst
					votesAbstain
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
				title
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
