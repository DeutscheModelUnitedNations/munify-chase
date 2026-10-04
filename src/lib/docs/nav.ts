import { m } from '$lib/paraglide/messages';

/**
 * Sidebar structure of the user manual. Page titles come from each markdown
 * file's frontmatter, so only the order and the category labels live here.
 * Slugs are paths below `docs/<locale>/` without the `.md` extension.
 */
export type DocsNavCategory = {
	slug: string;
	label: () => string;
	description: () => string;
	items: string[];
};

export type DocsNavEntry = string | DocsNavCategory;

export const docsNav: DocsNavEntry[] = [
	'user-manual/introduction',
	'user-manual/roles-overview',
	{
		slug: 'user-manual/chair',
		label: () => m.docsChairGuide(),
		description: () => m.docsChairGuideDescription(),
		items: [
			'user-manual/chair/getting-started',
			'user-manual/chair/committee-setup',
			'user-manual/chair/agenda-status',
			'user-manual/chair/roll-call-attendance',
			'user-manual/chair/speakers-list',
			'user-manual/chair/voting',
			'user-manual/chair/requests',
			'user-manual/chair/resolutions',
			'user-manual/chair/amendments-review',
			'user-manual/chair/whiteboard',
			'user-manual/chair/presentation-mode',
			'user-manual/chair/statistics',
			'user-manual/chair/ai-assistance'
		]
	},
	{
		slug: 'user-manual/participant',
		label: () => m.docsParticipantGuide(),
		description: () => m.docsParticipantGuideDescription(),
		items: [
			'user-manual/participant/getting-started',
			'user-manual/participant/committee-overview',
			'user-manual/participant/speakers-list',
			'user-manual/participant/requests',
			'user-manual/participant/voting',
			'user-manual/participant/attendance',
			'user-manual/participant/resolutions-basics',
			'user-manual/participant/writing-resolutions',
			'user-manual/participant/sponsorship-share-codes',
			'user-manual/participant/amendments',
			'user-manual/participant/statistics'
		]
	},
	{
		slug: 'user-manual/admin',
		label: () => m.docsAdminGuide(),
		description: () => m.docsAdminGuideDescription(),
		items: [
			'user-manual/admin/getting-started',
			'user-manual/admin/mission-control',
			'user-manual/admin/conference-setup',
			'user-manual/admin/committees-delegations',
			'user-manual/admin/nsa-management',
			'user-manual/admin/requests',
			'user-manual/admin/users-roles',
			'user-manual/admin/importing-delegator',
			'user-manual/admin/attendance-statistics'
		]
	},
	'faq'
];

export const DEFAULT_DOCS_SLUG = 'user-manual/introduction';

export function findCategory(slug: string) {
	return docsNav.find((e): e is DocsNavCategory => typeof e !== 'string' && e.slug === slug);
}

/** All page slugs in reading order, used for prev/next links. */
export function flatDocsSlugs() {
	return docsNav.flatMap((e) => (typeof e === 'string' ? [e] : [e.slug, ...e.items]));
}
