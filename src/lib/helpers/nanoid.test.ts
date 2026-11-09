import { describe, expect, it } from 'vitest';
import { isValidNanoid, nanoid, nanoidValidation } from './nanoid';

describe('nanoidValidation', () => {
	it("keeps the client's id", () => {
		const id = nanoid();
		expect(nanoidValidation.parse(id)).toBe(id);
	});

	it('makes an id when the client sent none or an invalid one', () => {
		expect(isValidNanoid(nanoidValidation.parse(undefined))).toBe(true);
		expect(isValidNanoid(nanoidValidation.parse('not-an-id'))).toBe(true);
	});
});
