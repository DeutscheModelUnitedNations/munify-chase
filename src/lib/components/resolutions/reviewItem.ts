/** The amendment a review step decides on, as the obsolescence and rewrite steps display it */
export type ReviewSubjectAmendment =
	| {
			documentNumber: string | null | undefined;
			type: string | null | undefined;
			status: string | null | undefined;
			newContent: string | null | undefined;
			targetOperativeIndex: number | null | undefined;
			proposer:
				| {
						representation:
							| {
									name: string | null | undefined;
									alpha2Code: string | null | undefined;
									alpha3Code: string | null | undefined;
									faIcon: string | null | undefined;
									type: string | null | undefined;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined;
			sponsors: Array<{ id: string }> | null | undefined;
	  }
	| null
	| undefined;
