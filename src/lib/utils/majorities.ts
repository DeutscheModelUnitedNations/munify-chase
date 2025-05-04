export function getSimpleMajority(total: number): number {
	return Math.floor(total / 2) + 1;
}

export function isSimpleMajority(votes: number, total: number): boolean {
	return votes >= getSimpleMajority(total);
}

export function getTwoThirdsMajority(total: number): number {
	return Math.ceil((2 * total) / 3);
}

export function isTwoThirdsMajority(votes: number, total: number): boolean {
	return votes >= getTwoThirdsMajority(total);
}

export function getPaperSupportThreshold(total: number): number {
	return Math.ceil(total * 0.1);
}

export function isPaperSupportThreshold(votes: number, total: number): boolean {
	return votes >= getPaperSupportThreshold(total);
}

export function isCustumFixedMajority(votes: number, majority: number): boolean {
	return votes >= majority;
}
