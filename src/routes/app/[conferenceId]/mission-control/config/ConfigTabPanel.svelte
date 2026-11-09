<script module lang="ts">
	export type ConfigTab = 'general' | 'users' | 'committees' | 'delegations' | 'nsa' | 'requestTypes';
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import GeneralTab from './GeneralTab.svelte';
	import UsersTab from './UsersTab.svelte';
	import CommitteesTab from './CommitteesTab.svelte';
	import DelegationsTab from './DelegationsTab.svelte';
	import NsaTab from './NsaTab.svelte';
	import RequestTypesTab from './RequestTypesTab.svelte';

	interface Props {
		/** The tab to show, none when it is not available */
		tab: ConfigTab | undefined;
		conference: ComponentProps<typeof GeneralTab>['conference'] &
			ComponentProps<typeof UsersTab>['conference'] & {
				representations: ComponentProps<typeof DelegationsTab>['representations'] | null;
				requestTypes: ComponentProps<typeof RequestTypesTab>['requestTypes'] | null;
			};
		currentUserEmail: string | undefined;
	}
	let { tab, conference, currentUserEmail }: Props = $props();
</script>

{#if tab === 'general'}
	<GeneralTab {conference} />
{:else if tab === 'users'}
	<UsersTab {conference} {currentUserEmail} />
{:else if tab === 'committees'}
	<CommitteesTab conferenceId={conference.id} committees={conference.committees ?? []} />
{:else if tab === 'delegations'}
	<DelegationsTab
		conferenceId={conference.id}
		representations={conference.representations ?? []}
		committees={conference.committees ?? []}
	/>
{:else if tab === 'nsa'}
	<NsaTab conferenceId={conference.id} representations={conference.representations ?? []} />
{:else if tab === 'requestTypes'}
	<RequestTypesTab conferenceId={conference.id} requestTypes={conference.requestTypes ?? []} />
{/if}
