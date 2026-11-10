import { describe, expect, it } from 'vitest';
import {
	getCommitteeStatusBackground,
	getCommitteeStatusIcon,
	getCommitteeStatusText
} from './committeeStatus';
import * as m from '#lib/paraglide/messages';

describe('committee status display', () => {
	it('names, pictures and colours every status', () => {
		expect(getCommitteeStatusText('FORMAL')).toBe(m.formalDebate());
		expect(getCommitteeStatusText('MODERATED_INFORMAL')).toBe(m.moderatedInformalCaucus());
		expect(getCommitteeStatusIcon('PAUSE')).toBe('coffee');
		expect(getCommitteeStatusIcon('INFORMAL')).toBe('chats');
		expect(getCommitteeStatusBackground('SUSPENSION')).toBe('bg-info');
		expect(getCommitteeStatusBackground('FORMAL')).toBe('bg-base-200');
	});

	it('prefers a custom text', () => {
		expect(getCommitteeStatusText('FORMAL', 'Lunch')).toBe('Lunch');
	});

	it('stays neutral for a status it does not know', () => {
		// @ts-expect-error a status a newer server might send
		expect(getCommitteeStatusText('VOTING')).toBe('');
		// @ts-expect-error a status a newer server might send
		expect(getCommitteeStatusIcon('VOTING')).toBe('question');
		// @ts-expect-error a status a newer server might send
		expect(getCommitteeStatusBackground('toString')).toBeUndefined();
	});
});
