<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';
	import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';
</script>

<header
	class="enter-fade mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-7 md:px-12"
>
	<a class="text-xl leading-none" href={resolve('/(pages)')}>
		<span class="font-light">MUNify</span> <span class="font-bold">CHASE</span>
	</a>
	<nav class="flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
		<a
			class="link link-hover hidden sm:inline"
			href={resolve('/(pages)/docs/[...slug]', { slug: '' })}
		>
			{m.homeDocsTitle()}
		</a>
		<a
			class="link link-hover hidden sm:inline"
			href="https://github.com/DeutscheModelUnitedNations/munify-chase"
			target="_blank"
		>
			GitHub
		</a>
		<a
			class="link link-hover hidden sm:inline"
			href={resolve('/app/[conferenceId]/mission-control', { conferenceId: LOCAL_CONFERENCE_ID })}
		>
			{m.tryOfflineDemo()}
			<span class="badge badge-warning badge-xs font-bold uppercase">{m.betaTag()}</span>
		</a>
		<!-- Full page load: /app has no server load, so a client-side navigation would skip the OIDC check -->
		<a class="btn btn-primary btn-sm" href={resolve('/app')} data-sveltekit-reload>
			{m.login()}
		</a>
	</nav>
</header>
