/** `index` wrapped into `0..length-1`, so stepping past either end continues at the other */
export function wrapIndex(index: number, length: number): number {
	return ((index % length) + length) % length;
}
