import type { LauncherBadge } from '$lib/helpers/launcher';

export type LauncherRepresentation = {
	type?: 'DELEGATION' | 'NSA' | 'UN' | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	faIcon?: string | null;
	name?: string | null;
};

export type LauncherConference = {
	id: string;
	title: string;
	location?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	committees: ReadonlyArray<{ abbreviation: string }>;
	role: LauncherBadge;
	roleDetail?: string | null;
	representation?: LauncherRepresentation | null;
	href: string;
};
