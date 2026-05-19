import { nanoid } from './nanoid';

const ID_REGEX = /^[6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz]{30}$/;

/**
 * Returns a valid nanoid: either the client-supplied ID if it passes format
 * validation, or a freshly generated one. Server remains authoritative —
 * callers must use the returned value, not assume the supplied one was accepted.
 */
export function resolveId(preferredId?: string | null): string {
	if (preferredId && ID_REGEX.test(preferredId)) {
		return preferredId;
	}
	return nanoid();
}
