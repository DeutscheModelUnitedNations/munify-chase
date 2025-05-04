<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChairNavbar from './ChairNavbar.svelte';
	import type { LayoutData } from './$houdini';
	import * as m from '$lib/paraglide/messages';

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
