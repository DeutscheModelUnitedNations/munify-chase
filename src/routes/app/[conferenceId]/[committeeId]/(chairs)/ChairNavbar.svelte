<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import CurrentTime from '#lib/components/CurrentTime.svelte';
	import ConferenceMenu from '../../ConferenceMenu.svelte';
	import NavbarSpeakersWidget from '#lib/components/speakersList/NavbarSpeakersWidget.svelte';

	import { getCurrentUser, getIsGlobalAdmin } from '#lib/state/currentUser.svelte';

	type SpeakersList = ComponentProps<typeof NavbarSpeakersWidget>['speakersList'];

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

	const isGlobalAdmin = await getIsGlobalAdmin();
</script>

<!-- Slim top bar -->
<div class="navbar bg-base-100 sticky top-0 z-10 shadow-sm">
	<h1 class="ml-4 text-3xl font-bold" style="view-transition-name: committee-abbr-{committeeId};">
		{title ?? ''}
	</h1>

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
		<ConferenceMenu
			{role}
			{conferenceId}
			{conferenceTitle}
			committees={conference?.committees}
			isGlobalAdmin={!!isGlobalAdmin}
			user={currentUser}
		/>
	</div>
</div>
