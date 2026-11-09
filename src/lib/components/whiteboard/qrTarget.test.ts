import { describe, expect, it } from 'vitest';
import { committeeUrl, dialogChange } from './qrTarget';

describe('committeeUrl', () => {
	const args = { origin: 'https://x', conferenceId: 'c f', committeeId: 'k', includePapers: false };

	it('leads to the participant page or its papers', () => {
		expect(committeeUrl(args)).toBe('https://x/app/c%20f/participant/k');
		expect(committeeUrl({ ...args, includePapers: true })).toBe(
			'https://x/app/c%20f/participant/k/papers'
		);
	});

	it('is undefined while anything is missing', () => {
		expect(committeeUrl({ ...args, committeeId: undefined })).toBeUndefined();
		expect(committeeUrl({ ...args, conferenceId: '' })).toBeUndefined();
		expect(committeeUrl({ ...args, origin: '' })).toBeUndefined();
	});
});

describe('dialogChange', () => {
	it('opens or closes only on a mismatch', () => {
		expect(dialogChange({ showModal: true, isOpen: false })).toBe('open');
		expect(dialogChange({ showModal: false, isOpen: true })).toBe('close');
		expect(dialogChange({ showModal: true, isOpen: true })).toBeNull();
	});
});
