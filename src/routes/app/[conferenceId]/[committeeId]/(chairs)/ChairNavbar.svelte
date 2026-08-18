<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import NavbarSpeakersWidget from '$lib/components/speakersList/NavbarSpeakersWidget.svelte';
	import {
		buildConferenceNavItems,
		roleBadgeClassFor,
		roleLabelFor
	} from '$lib/components/navbar/conferenceNavItems';

	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import hotkeys from 'hotkeys-js';

	type SpeakersList =
		| {
				id: string;
				type: string;
				speakingTime: number;
				startTimestamp?: Date | null;
				timeLeft: number;
				phase?: string | null;
				speakers: Array<{
					id: string;
					position: number;
					overwriteName?: string | null;
					committeeMember?: {
						id: string;
						representation?: {
							name?: string | null;
							alpha2Code?: string | null;
							alpha3Code?: string | null;
							faIcon?: string | null;
							type?: string | null;
						} | null;
					} | null;
					conferenceMember?: {
						id: string;
						representation?: {
							name?: string | null;
							alpha2Code?: string | null;
							alpha3Code?: string | null;
							faIcon?: string | null;
							type?: string | null;
						} | null;
					} | null;
				}>;
		  }
		| null
		| undefined;

	interface Props {
		title?: string;
		conferenceTitle?: string | null;
		speakersList?: SpeakersList;
		commentList?: SpeakersList;
	}

	let { title, conferenceTitle, speakersList, commentList }: Props = $props();

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);

	const currentUser = await getCurrentUser();
	const userId = currentUser.id ?? '';
	const userDisplayName =
		[currentUser.givenName, currentUser.familyName].filter(Boolean).join(' ').trim() ||
		currentUser.preferredUsername ||
		currentUser.email ||
		'';

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: { eq: page.params.conferenceId } },
				user: { id: { eq: userId } }
			}
		},
		id: true,
		conferenceUserType: true
	});

	let role = $derived(conferenceUsers?.[0]?.conferenceUserType);

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true
		}
	});

	const isGlobalAdmin = await client.query.isGlobalAdmin();

	let menubarItems = $derived(
		buildConferenceNavItems({
			role,
			conferenceId,
			activeRouteId: page.route.id,
			activePathname: page.url.pathname,
			isGlobalAdmin: !!isGlobalAdmin
		})
	);

	$effect(() => {
		hotkeys('alt+1, alt+2, alt+3, alt+4', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'alt+1':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+2':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/presence', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+3':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
							conferenceId,
							committeeId
						})
					);
					break;
				case 'alt+4':
					goto(
						resolve('/app/[conferenceId]/[committeeId]/(chairs)/voting', {
							conferenceId,
							committeeId
						})
					);
					break;
			}
		});
	});
</script>

<!-- Slim top bar -->
<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<h1 class="ml-4 text-3xl font-bold">{title ?? ''}</h1>

	<div class="flex-1"></div>

	{#if !page.route.id?.includes('speakers-list') && speakersList}
		<div class="absolute left-1/2 -translate-x-1/2">
			<NavbarSpeakersWidget {speakersList} {commentList} />
		</div>
	{/if}

	<div class="flex-none">
		<CurrentTime />
	</div>

	<div class="flex-none">
		<NavbarBurgerMenu
			items={menubarItems}
			user={{
				name: userDisplayName,
				email: currentUser.email ?? undefined,
				givenName: currentUser.givenName ?? undefined,
				familyName: currentUser.familyName ?? undefined
			}}
			roleLabel={roleLabelFor(role)}
			roleBadgeClass={roleBadgeClassFor(role)}
			{conferenceTitle}
			{conferenceId}
			committees={role === 'ADMIN' || role === 'TEAM' ? (conference?.committees ?? []) : []}
			dashboardHref="/app"
			signOutHref="/logout"
		/>
	</div>
</div>
