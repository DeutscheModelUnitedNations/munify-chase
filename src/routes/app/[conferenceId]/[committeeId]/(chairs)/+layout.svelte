<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChairNavbar from './ChairNavbar.svelte';
	import type { LayoutData } from './$houdini';
	import * as m from '$lib/paraglide/messages';
	import StatusChangerModal from '$lib/components/committee/StatusChangerModal.svelte';
	import StateOfDebateChangerModal from '$lib/components/committee/StateOfDebateChangerModal.svelte';

	interface Props {
		children: Snippet;
		data: LayoutData;
	}

	let { data, children }: Props = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived($query.data?.findFirstCommittee);
</script>

<ChairNavbar title={committee?.abbreviation} />

{@render children()}

<StatusChangerModal
	committeeId={data.committeeId}
	oldStatus={committee?.status}
	oldUntil={committee?.statusUntil}
	oldCustomName={committee?.statusHeadline}
/>

<StateOfDebateChangerModal
	committeeId={data.committeeId}
	oldStateOfDebate={committee?.stateOfDebate}
/>
