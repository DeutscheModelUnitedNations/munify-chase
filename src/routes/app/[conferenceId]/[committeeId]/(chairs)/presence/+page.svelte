<script lang="ts">
	import ChairNavbar from '../ChairNavbar.svelte';

	import { page } from '$app/state';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from '../../settings/$houdini';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived($query.data?.findFirstCommittee);
</script>

<DevPlaceholder
	data={{
		...data,
		...committee
	}}
/>
