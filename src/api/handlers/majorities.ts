export type MajorityType = 'simple' | 'twoThirds';

export function calculateMajority(total: number, type: MajorityType): number {
	switch (type) {
		case 'simple': {
			const majority = (total / 2) % 1 === 0 ? total / 2 + 1 : Math.ceil(total / 2);
			return majority > total ? total : majority;
		}
		case 'twoThirds':
			return Math.ceil((total * 2) / 3);
		default:
			return 0;
	}
}
