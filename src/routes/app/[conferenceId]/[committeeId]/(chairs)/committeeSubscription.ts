import { graphql } from '$houdini';

export const CommitteeSubscription = graphql(`
	subscription CommitteeSubscription($id: ID!) {
		findFirstCommittee(where: { id: $id }) {
			id
			abbreviation
			name
			resolutionHeadline
			stateOfDebate
			status
			statusHeadline
			statusUntil
			totalPresent
			simpleMajority
			twoThirdsMajority
			paperSupportThreshold
			maxDraftResolutions
			activeDraftResolutionId
			supportReEvaluationOpen
			amendmentSubmissionOpen
			amendmentSponsoringOpen
			currentOperativeIndex
			currentOperativeClauseId
			activeAmendmentId
			whiteboardContent
			lastResolutionAdoptionDate
			allowDelegationsToAddThemselvesToSpeakersList
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
				title
				hasModeratedCaucus
				resolutionFeatureEnabled
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
