import { describe, expect, it } from 'vitest';
import { committeesSeating, seatChanges, seatOf, type Committee } from './delegations';

const committee = (id: string, seated: string[]): Committee => ({
	id,
	name: id,
	abbreviation: id.toUpperCase(),
	members: seated.map((rep) => ({ id: `${id}-${rep}`, representation: { id: rep } }))
});

const committees = [
	committee('ga', ['peru']),
	committee('sc', ['chad']),
	committee('hrc', ['peru'])
];

describe('seats', () => {
	it("finds a representation's seat", () => {
		expect(seatOf({ committee: committees[0], representationId: 'peru' })?.id).toBe('ga-peru');
		expect(seatOf({ committee: committees[1], representationId: 'peru' })).toBeUndefined();
	});

	it('lists the committees seating it', () => {
		expect(committeesSeating({ committees, representationId: 'peru' }).map((c) => c.id)).toEqual([
			'ga',
			'hrc'
		]);
	});

	it('works out which seats to add and remove', () => {
		const { add, remove } = seatChanges({
			committees,
			representationId: 'peru',
			wanted: new Set(['ga', 'sc'])
		});
		expect(add.map((c) => c.id)).toEqual(['sc']);
		expect(remove.map((r) => [r.committee.id, r.memberId])).toEqual([['hrc', 'hrc-peru']]);
	});
});
