import type { Page } from 'playwright';
import { setActiveDraftResolution, startDeviceVote, startSpeech } from './stage';
import type { Shot, StageIds } from './types';

const conference = (path: string) => (ids: StageIds) => `/app/${ids.conferenceId}/${path}`;
const chair = (path: string) => (ids: StageIds) =>
	`/app/${ids.conferenceId}/${ids.committeeId}/${path}`;
const participant =
	(path = '') =>
	(ids: StageIds) =>
		`/app/${ids.conferenceId}/participant/${ids.committeeId}${path}`;

// The AI onboarding dialog opens on every paper page until it was answered once
const AI_OFF = { 'chase:ai:onboarded': 'true', 'chase:ai:mode': 'off' };
const MODAL = 'dialog.modal[open] .modal-box, .modal.modal-open .modal-box';

const configTab =
	(index: number) =>
	async ({ page }: { page: Page }) => {
		await page.locator('button[role="tab"]').nth(index).click();
		await page.waitForTimeout(800);
	};

/**
 * Every screenshot used in the manual. The docs test fails when a page references
 * `shot:<id>` that isn't listed here, or when a listed shot hasn't been generated.
 * Run `bun run docs:screenshots` after changing this list or the UI it shows.
 */
export const SHOTS: Shot[] = [
	// Admin

	{ id: 'admin/launcher-global-admin', role: 'admin', path: () => '/app' },
	{
		id: 'admin/mission-control-dashboard',
		role: 'admin',
		path: conference('mission-control'),
		setup: startSpeech,
		prepare: ({ page }) => page.waitForTimeout(1500)
	},
	{ id: 'admin/general-tab', role: 'admin', path: conference('mission-control/config') },
	{
		id: 'admin/users-tab',
		role: 'admin',
		path: conference('mission-control/config'),
		prepare: configTab(1),
		viewport: { width: 1280, height: 1000 }
	},
	{
		id: 'admin/committees-tab',
		role: 'admin',
		path: conference('mission-control/config'),
		prepare: configTab(2)
	},
	{
		id: 'admin/delegations-tab',
		role: 'admin',
		path: conference('mission-control/config'),
		prepare: configTab(3)
	},
	{
		id: 'admin/nsa-tab',
		role: 'admin',
		path: conference('mission-control/config'),
		prepare: configTab(4)
	},
	{
		id: 'admin/requests-tab',
		role: 'admin',
		path: conference('mission-control/config'),
		prepare: configTab(5)
	},
	// A team member sees the note that only Global Admins can apply the result
	{ id: 'admin/import-start', role: 'team', path: () => '/app/import' },
	{
		id: 'admin/import-wizard-basics',
		role: 'admin',
		path: () => '/app/import',
		prepare: async ({ page, t }) => {
			await page.getByText(t('startFreshTitle')).click();
		}
	},
	{
		id: 'admin/import-wizard-requests',
		role: 'admin',
		path: () => '/app/import',
		prepare: async ({ page, t }) => {
			await page.getByText(t('startFreshTitle')).click();
			await page.locator('ul.steps li button').nth(4).click();
			await page.getByRole('button', { name: t('loadDefaultRequestTypes') }).click();
		},
		viewport: { width: 1280, height: 1000 }
	},
	{
		id: 'admin/attendance-by-nsa',
		role: 'admin',
		path: conference('attendance'),
		prepare: configTab(2)
	},

	// Chair

	{
		id: 'chair/mission-control-overview',
		role: 'admin',
		path: conference('mission-control'),
		prepare: ({ page }) => page.waitForTimeout(1500)
	},
	{ id: 'chair/setup-page', role: 'admin', path: chair('setup') },
	{
		id: 'chair/navbar-speech-widget',
		role: 'admin',
		path: chair('voting'),
		setup: startSpeech,
		clip: 'div.navbar.sticky'
	},
	{ id: 'chair/presence-page', role: 'admin', path: chair('presence') },
	{
		id: 'chair/speakers-list',
		role: 'admin',
		path: chair('speakers-list'),
		// Wide enough for the status sidebar, which only shows on very wide screens
		viewport: { width: 1600, height: 900 }
	},
	{ id: 'chair/voting-setup', role: 'admin', path: chair('voting') },
	{
		id: 'chair/voting-show-of-hands',
		role: 'admin',
		path: chair('voting'),
		prepare: async ({ page, t }) => {
			await page
				.getByRole('tab', { name: t('withAbstentions') })
				.first()
				.click();
			await page
				.getByRole('button', { name: t('startVote') })
				.first()
				.click();
			const modal = page.locator(MODAL).first();
			await modal.waitFor();
			// Count with the arrow buttons, the next counter unlocks after "Next"
			const increase = modal.locator('button[aria-label="increase-vote"]:enabled');
			for (let i = 0; i < 24; i++) await increase.first().click();
			await modal.getByRole('button', { name: t('forward') }).click();
			for (let i = 0; i < 9; i++) await increase.first().click();
		},
		clip: MODAL
	},
	{ id: 'chair/requests-page', role: 'admin', path: chair('requests') },
	{
		id: 'chair/request-toast',
		role: 'admin',
		path: chair('setup'),
		prepare: async ({ page, ids, t, openAs }) => {
			// Requests pending when the chair page loaded are not announced, so file one now
			const delegate = await openAs('delegate', participant()(ids));
			await delegate.getByRole('button', { name: t('makeARequest') }).click();
			await delegate.locator(MODAL).getByText(t('requestTypeInformalSession')).click();
			await page.getByText(t('viewRequests')).waitFor({ timeout: 15_000 });
		},
		clip: (page, t) =>
			page.getByText(t('viewRequests')).locator('xpath=ancestor::div[@role="status"][1]/..')
	},
	{ id: 'chair/resolutions-list', role: 'admin', path: chair('resolutions') },
	{
		id: 'chair/resolution-voting-phase',
		role: 'admin',
		path: (ids) => chair(`resolutions/${ids.votingPhasePaperId}`)(ids),
		storage: AI_OFF
	},
	{
		id: 'chair/clause-vote-setup',
		role: 'admin',
		path: (ids) => chair(`resolutions/${ids.votingPhasePaperId}`)(ids),
		storage: AI_OFF,
		prepare: async ({ page, t }) => {
			await page
				.getByRole('button', { name: t('startClauseVote') })
				.first()
				.click();
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{
		id: 'chair/amendment-review',
		role: 'admin',
		path: (ids) => chair(`resolutions/${ids.amendmentPhasePaperId}`)(ids),
		setup: (ids) => setActiveDraftResolution(ids, ids.amendmentPhasePaperId),
		storage: AI_OFF,
		prepare: async ({ page, t }) => {
			await page
				.getByRole('tab', { name: t('amendments') })
				.first()
				.click();
		}
	},
	{
		id: 'chair/amendment-decide-menu',
		role: 'admin',
		path: (ids) => chair(`resolutions/${ids.amendmentPhasePaperId}`)(ids),
		setup: (ids) => setActiveDraftResolution(ids, ids.amendmentPhasePaperId),
		storage: AI_OFF,
		prepare: async ({ page, t }) => {
			await page
				.getByRole('tab', { name: t('amendments') })
				.first()
				.click();
			await page
				.getByRole('button', { name: t('decideManually') })
				.first()
				.click();
		}
	},
	{
		id: 'chair/ai-onboarding-modal',
		role: 'admin',
		path: (ids) => chair(`resolutions/${ids.draftResolutionId}`)(ids),
		prepare: async ({ page }) => {
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{
		id: 'chair/whiteboard-editor',
		role: 'admin',
		path: chair('setup'),
		prepare: async ({ page, t }) => {
			await page
				.getByRole('button', { name: t('edit') })
				.first()
				.click();
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{
		id: 'chair/presentation-default',
		role: 'admin',
		path: (ids) => `/app/${ids.conferenceId}/${ids.committeeId}`,
		viewport: { width: 1920, height: 1080 }
	},
	{ id: 'chair/statistics', role: 'admin', path: conference('statistics') },

	// Participant

	{ id: 'participant/launcher', role: 'delegate', path: () => '/app' },
	{ id: 'participant/committee-dashboard', role: 'delegate', path: participant() },
	{
		id: 'participant/avatar-menu',
		role: 'delegate',
		path: participant(),
		prepare: async ({ page }) => {
			await page.locator('button[aria-haspopup="menu"]').first().click();
		},
		clip: 'div.rounded-box.absolute.top-5.right-5'
	},
	{
		id: 'participant/speakers-list-card',
		role: 'delegate',
		path: participant(),
		clip: '.card:has(i.fa-minus)'
	},
	{
		id: 'participant/requests-card',
		role: 'delegate',
		path: participant(),
		clip: '.card:has(i.fa-hand)'
	},
	{
		id: 'participant/make-request',
		role: 'delegate',
		path: participant(),
		prepare: async ({ page, t }) => {
			await page.getByRole('button', { name: t('makeARequest') }).click();
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{
		id: 'participant/device-vote',
		role: 'delegate',
		path: participant(),
		setup: startDeviceVote,
		prepare: async ({ page }) => {
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{ id: 'participant/papers-list', role: 'delegate', path: participant('/papers') },
	{
		id: 'participant/paper-amendments',
		role: 'delegate',
		path: (ids) => participant(`/papers/${ids.amendmentPhasePaperId}`)(ids)
	},
	{
		id: 'participant/amendment-queue',
		role: 'delegate',
		path: (ids) => participant(`/papers/${ids.amendmentPhasePaperId}`)(ids),
		prepare: async ({ page, t }) => {
			await page
				.getByRole('tab', { name: t('amendments') })
				.first()
				.click();
		},
		clip: 'aside:has([role="tablist"])'
	},
	{
		id: 'participant/sponsors-panel',
		role: 'delegate',
		path: (ids) => participant(`/papers/${ids.submittedPaperId}`)(ids),
		prepare: async ({ page }) => {
			await page.locator('button:has(i.fa-users-gear)').first().click();
			await page.locator(MODAL).first().waitFor();
		},
		clip: MODAL
	},
	{ id: 'participant/statistics', role: 'delegate', path: conference('statistics') }
];
