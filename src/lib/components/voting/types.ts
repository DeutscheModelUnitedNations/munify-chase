/** The committee fields the voting components read to count and display votes */
export type VotingCommittee = {
	id: string;
	totalPresent: number;
	simpleMajority: number;
	twoThirdsMajority: number;
	members: Array<{
		id: string;
		present: boolean;
		representation?: {
			name?: string | null;
			alpha2Code?: string | null;
			alpha3Code?: string | null;
			faIcon?: string | null;
			type?: string | null;
			regionalGroup?: string | null;
		} | null;
	}>;
};
