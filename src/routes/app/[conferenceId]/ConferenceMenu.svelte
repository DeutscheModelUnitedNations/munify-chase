<script lang="ts">
	import { page } from '$app/state';
	import NavbarBurgerMenu from '#lib/components/NavbarBurgerMenu.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor,
		type ConferenceUserRole
	} from '#lib/components/navbar/conferenceNavItems';
	import { displayNameOf } from '#lib/helpers/displayName';

	interface Props {
		role: ConferenceUserRole;
		conferenceId: string;
		conferenceTitle?: string | null;
		/** The conference's committees, listed for the team and admins only */
		committees?: { id: string; name: string; abbreviation: string }[];
		/** Overrides who sees the committees, by default the team and admins */
		listCommittees?: boolean;
		isGlobalAdmin?: boolean;
		user:
			| {
					givenName?: string | null;
					familyName?: string | null;
					preferredUsername?: string | null;
					email?: string | null;
			  }
			| null
			| undefined;
	}

	let {
		role,
		conferenceId,
		conferenceTitle,
		committees = [],
		listCommittees,
		isGlobalAdmin = false,
		user
	}: Props = $props();

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin
		})
	);
</script>

<NavbarBurgerMenu
	items={menubarItems}
	user={{
		name: displayNameOf(user),
		email: user?.email ?? undefined,
		givenName: user?.givenName ?? undefined,
		familyName: user?.familyName ?? undefined
	}}
	roleLabel={roleLabelFor(role)}
	roleBadgeClass={roleBadgeClassFor(role)}
	{conferenceTitle}
	{conferenceId}
	committees={(listCommittees ?? (role === 'ADMIN' || role === 'TEAM')) ? committees : []}
	dashboardHref="/app"
	signOutHref="/logout"
/>
