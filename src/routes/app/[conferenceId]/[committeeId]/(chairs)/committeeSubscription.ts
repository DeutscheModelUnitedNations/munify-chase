import { graphql } from '$houdini';

export const CommitteeSubscription = graphql(`
	subscription CommitteeSubscription($id: ID!) {
		findFirstCommittee(where: { id: $id }) {
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
			activeAgendaItem {
				id
				title
			}
			agendaItems {
				id
				title
			}
			whiteboardContent
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
		}
	}
`);
