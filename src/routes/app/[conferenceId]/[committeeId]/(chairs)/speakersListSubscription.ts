import { graphql } from '$houdini';

export const SpeakersListSubscription = graphql(`
	subscription SpeakersListSubscription($committeeId: ID!) {
		findFirstCommittee(where: { id: $committeeId }) {
			id
			abbreviation
			name
			stateOfDebate
			status
			statusHeadline
			statusUntil
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
					regionalGroup
					alpha2Code
					alpha3Code
					faIcon
				}
			}
		}
	}
`);
