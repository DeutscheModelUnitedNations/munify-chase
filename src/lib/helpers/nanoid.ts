import { customAlphabet } from 'nanoid';
import z from 'zod';

// https://github.com/CyberAP/nanoid-dictionary?tab=readme-ov-file#nolookalikessafe
export const NANOID_ALPHABET = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz';
export const NANOID_LENGTH = 30;
export const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH);

const NANOID_RE = new RegExp(`^[${NANOID_ALPHABET}]{${NANOID_LENGTH}}$`);
export const isValidNanoid = (id: string): boolean => NANOID_RE.test(id);
/** The id a client chose for a row it creates (offline-first), or a fresh one when it chose none. */
export const nanoidValidation = z
	.string()
	.optional()
	.transform((val) => (val && isValidNanoid(val) ? val : nanoid()));
