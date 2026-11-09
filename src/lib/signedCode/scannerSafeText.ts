/**
 * The text signed codes are written in: base 32 over an alphabet a keyboard scanner cannot get
 * wrong. Hand scanners type what they read as if on a US keyboard, so on a German layout Y and Z
 * swap and punctuation turns into other characters; they may also flip the case. The alphabet
 * leaves out the letters that get swapped or mistaken for digits (I, O, Y, Z) and is read in any
 * case. Uppercase, it is also what a QR code's compact alphanumeric mode holds.
 */
const ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWX';

export function isScannerSafeChar(char: string) {
	return ALPHABET.includes(char.toUpperCase());
}

export function toScannerSafe(bytes: Uint8Array): string {
	let text = '';
	let buffer = 0;
	let bits = 0;
	for (const byte of bytes) {
		buffer = (buffer << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			text += ALPHABET[(buffer >>> (bits - 5)) & 31];
			bits -= 5;
		}
		buffer &= (1 << bits) - 1;
	}
	return bits > 0 ? text + ALPHABET[(buffer << (5 - bits)) & 31] : text;
}

/** The bytes `text` stands for; `null` when it holds a character outside the alphabet. */
export function fromScannerSafe(text: string): Uint8Array<ArrayBuffer> | null {
	const bytes: number[] = [];
	let buffer = 0;
	let bits = 0;
	for (const char of text.toUpperCase()) {
		const value = ALPHABET.indexOf(char);
		if (value < 0) return null;
		buffer = (buffer << 5) | value;
		bits += 5;
		if (bits >= 8) {
			bytes.push((buffer >>> (bits - 8)) & 255);
			bits -= 8;
			buffer &= (1 << bits) - 1;
		}
	}
	return Uint8Array.from(bytes);
}
