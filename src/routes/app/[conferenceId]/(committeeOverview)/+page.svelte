<script lang="ts">
import CommitteeGrid from "$lib/components/CommitteeGrid.svelte";
import CurrentTime from "$lib/components/CurrentTime.svelte";
import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
import * as m from "$lib/paraglide/messages.js";
import type { PageData } from "./$houdini";

const { data }: { data: PageData } = $props();

const query = $derived(data?.CommitteeOverviewQuery);
const conference = $derived($query.data?.findFirstConference);
</script>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.committeeOverview()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<ThemeSwitcher />
		<a class="btn btn-ghost btn-square" href="/app" aria-label="Go back to app">
			<i class="fa-duotone fa-home"></i>
		</a>
	</div>
</div>

{#if conference}
	<CommitteeGrid {conference} />
{/if}
