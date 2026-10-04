import type { Locator, Page } from 'playwright';
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

export type PrepareContext = {
	page: Page;
	ids: StageIds;
	t: Translate;
	/** Opens a second page logged in as another role, closed after the capture */
	openAs: (role: Role, path: string) => Promise<Page>;
};

export type Shot = {
	/** Referenced from markdown as `shot:<id>` */
	id: string;
	role: Role;
	path: (ids: StageIds) => string;
	/** Database state on top of the staged conference, before the page loads */
	setup?: (ids: StageIds) => Promise<void>;
	/** Clicks and key presses to reach the view after the page loaded */
	prepare?: (ctx: PrepareContext) => Promise<void>;
	/** localStorage entries set before the page loads */
	storage?: Record<string, string>;
	/** Captures only this element instead of the viewport */
	clip?: string | ((page: Page, t: Translate) => Locator);
	viewport?: { width: number; height: number };
	fullPage?: boolean;
};
