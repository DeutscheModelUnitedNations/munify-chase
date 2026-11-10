import { describe, expect, it } from 'vitest';
import { queueMetrics, representationLabel, shortCode, speakerMember } from './speakerQueue';

describe('speakerMember', () => {
	it('prefers the committee seat', () => {
		const committeeMember = { representation: { name: 'A' } };
		const conferenceMember = { representation: { name: 'B' } };
		expect(speakerMember({ committeeMember, conferenceMember })).toBe(committeeMember);
		expect(speakerMember({ committeeMember: null, conferenceMember })).toBe(conferenceMember);
		expect(speakerMember({})).toBeUndefined();
	});
});

describe('labels', () => {
	it('names the representation or its country', () => {
		expect(representationLabel({ representation: { name: 'WHO' } })).toBe('WHO');
		expect(representationLabel({ representation: { alpha3Code: 'DEU' } })).toBeTruthy();
	});

	it('shows the alpha-2 code', () => {
		expect(shortCode({ representation: { alpha2Code: 'de' } })).toBe('DE');
		expect(shortCode(undefined)).toBe('N/A');
	});
});

describe('queueMetrics', () => {
	it('falls back while nothing is measured', () => {
		expect(
			queueMetrics({ containerHeight: 300, firstRowHeight: undefined, overflowHeight: 0 })
		).toEqual({ containerHeight: 300, rowHeight: 20, reservedHeight: 50 });
		expect(queueMetrics({ containerHeight: 300, firstRowHeight: 60, overflowHeight: 80 })).toEqual({
			containerHeight: 300,
			rowHeight: 60,
			reservedHeight: 80
		});
	});
});
