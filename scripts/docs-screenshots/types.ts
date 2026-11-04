import type { Shot as KitShot } from '@deutschemodelunitednations/docs-kit/capture';
import type en from '../../messages/en.json';

export type MessageKey = Exclude<keyof typeof en, '$schema'>;
/** Looks up an app message in the locale being captured */
export type Translate = (key: MessageKey) => string;

/** Mock OIDC users from oidc-mock.yaml, by their `sub` */
export const ROLE_LOGINS = {
	// Global Admin, also admin of the dev conference
	admin: 'admin',
	// Conference team member, not a Global Admin
	team: 'user',
	// Delegate of Germany in the General Assembly (GV)
	delegate: 'gv.de'
} as const;

export type Role = keyof typeof ROLE_LOGINS;

export type StageIds = {
	conferenceId: string;
	committeeId: string;
	workingPaperId: string;
	submittedPaperId: string;
	draftResolutionId: string;
	amendmentPhasePaperId: string;
	votingPhasePaperId: string;
};

export type Shot = KitShot<StageIds, Role, MessageKey>;
