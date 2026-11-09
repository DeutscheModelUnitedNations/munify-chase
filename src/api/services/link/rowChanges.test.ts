import { describe, expect, it } from 'vitest';
import { displacedExtras, rowChanges } from './rowChanges';

const managed = { managedByDelegator: true };
const none: { id: string; name: string }[] = [];

describe('rowChanges', () => {
	it('writes nothing when every mirrored field is as it was', () => {
		const changes = rowChanges({
			current: [{ id: 'a', name: 'GA', ...managed }],
			wanted: [{ id: 'a', name: 'GA' }],
			fields: ['name']
		});
		expect(changes).toEqual({ write: [], created: false, remove: [] });
	});

	it('writes a new row and a changed one, and tells which is new', () => {
		const changes = rowChanges({
			current: [{ id: 'a', name: 'GA', ...managed }],
			wanted: [
				{ id: 'a', name: 'General Assembly' },
				{ id: 'b', name: 'SC' }
			],
			fields: ['name']
		});
		expect(changes.write.map((row) => row.id)).toEqual(['a', 'b']);
		expect(changes.created).toBe(true);
	});

	it('takes over a row CHASE kept as its own', () => {
		const changes = rowChanges({
			current: [{ id: 'a', name: 'GA', managedByDelegator: false }],
			wanted: [{ id: 'a', name: 'GA' }],
			fields: ['name']
		});
		expect(changes.write).toHaveLength(1);
		expect(changes.created).toBe(false);
	});

	it('removes managed rows DELEGATOR no longer has, never CHASE’s own', () => {
		const changes = rowChanges({
			current: [
				{ id: 'gone', name: 'x', ...managed },
				{ id: 'local', name: 'y', managedByDelegator: false }
			],
			wanted: none,
			fields: ['name']
		});
		expect(changes.remove).toEqual(['gone']);
	});

	it('compares dates by time and treats null and undefined alike', () => {
		const wanted: { id: string; start: Date; location?: string }[] = [
			{ id: 'a', start: new Date('2027-03-01') }
		];
		const changes = rowChanges({
			current: [{ id: 'a', start: new Date('2027-03-01'), location: null, ...managed }],
			wanted,
			fields: ['start', 'location']
		});
		expect(changes.write).toEqual([]);
	});
});

describe('displacedExtras', () => {
	const mirrored = [{ id: 'm1', userEmail: 'a@example.org' }];

	it('names a local extra sharing a mirrored address', () => {
		expect(
			displacedExtras({
				current: [{ id: 'x', userEmail: 'a@example.org', managedByDelegator: false }],
				mirrored
			})
		).toEqual(['x']);
	});

	it('keeps managed rows, the mirrored row itself and other addresses', () => {
		expect(
			displacedExtras({
				current: [
					{ id: 'm1', userEmail: 'a@example.org', managedByDelegator: false },
					{ id: 'm2', userEmail: 'a@example.org', managedByDelegator: true },
					{ id: 'y', userEmail: 'b@example.org', managedByDelegator: false }
				],
				mirrored
			})
		).toEqual([]);
	});
});
