<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Footer from '$lib/components/Footer.svelte';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();

	let launcherQuery = $derived(data?.LauncherQuery);
	$inspect($launcherQuery);
	let conferenceData = $derived($launcherQuery.data?.findManyConferenceUser ?? []);
</script>

<div class="navbar bg-base-200 relative shadow-sm">
	<div class="flex-none">
		<a class="btn btn-ghost" href="/">
			<i class="fa-duotone fa-arrow-left mr-2"></i>
			{m.logout()}
		</a>
	</div>
</div>

<div class="flex h-full flex-col items-center gap-10 p-10">
	<div class="flex flex-col items-center">
		<i class="fa-duotone fa-podium mb-4 text-7xl"></i>
		<h3 class="text-center text-2xl">MUNify</h3>
		<h3 class="text-center text-5xl font-bold">CHASE</h3>
		<p class="mt-4 text-center text-lg">
			{m.launcherWelcome({ name: data?.user.given_name })}
		</p>
	</div>
	<div class="card bg-base-200 w-full max-w-2xl shadow-sm">
		<div class="card-body">
			<h2 class="text-center text-4xl font-bold">Launcher</h2>
			<p class="text-center text-lg">
				{m.launcherDescription()}
			</p>
			<div class="mt-6 flex flex-col items-center gap-2">
				{#if conferenceData.length === 0}
					<div class="alert alert-warning shadow-sm">
						<i class="fas fa-exclamation-triangle"></i>
						{m.launcherNoConferences()}
					</div>
				{:else}
					{#each conferenceData as c}
						{@const conf = c.conference}
						<a href={`/app/${conf.id}`} class="btn btn-lg w-full max-w-xs shadow-xs">
							<i class="fa-duotone fa-rocket-launch mr-2"></i>
							{conf.title}
						</a>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
<Footer />
