import { graphql } from '$houdini';
import type { PrintPaperQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query PrintPaperQuery($documentId: ID!) {
		findFirstResolutionPaper(where: { id: $documentId }) {
			id
			content
			status
			documentNumber
			updatedAt
			agendaItem {
				title
			}
			creator {
				representation {
					name
					alpha3Code
				}
			}
			sponsors {
				id
				committeeMember {
					representation {
						name
						alpha3Code
					}
				}
			}
			committee {
				abbreviation
				name
				resolutionHeadline
				conference {
					title
				}
			}
		}
		findManyOperativeClauseVote(where: { paperId: $documentId }) {
			id
			clauseId
			outcome
			votesFor
			votesAgainst
			votesAbstain
		}
		findManyResolutionVoteResult(where: { paperId: $documentId }, limit: 1) {
			id
			outcome
			votesFor
			votesAgainst
			votesAbstain
		}
	}
`);

export const _PrintPaperQueryVariables: PrintPaperQueryVariables = (event) => {
	return {
		documentId: event.params.documentId
	};
};
