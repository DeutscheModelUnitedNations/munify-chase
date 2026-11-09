import type { LauncherConference } from './types';

/** Where a conference card leads: the chairs' mission control, the delegate's committee, or the participant view */
export function conferenceEntry({
	role,
	committeeId
}: Pick<LauncherConference, 'role' | 'committeeId'>):
	| { kind: 'missionControl' }
	| { kind: 'committee'; committeeId: string }
	| { kind: 'participant' } {
	if (role === 'ADMIN' || role === 'CHAIR') return { kind: 'missionControl' };
	if (role === 'DELEGATE' && committeeId) return { kind: 'committee', committeeId };
	return { kind: 'participant' };
}
