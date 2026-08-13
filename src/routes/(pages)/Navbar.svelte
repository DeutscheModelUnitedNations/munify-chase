<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages.js';
	import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';
</script>

<div class="navbar bg-base-100 relative shadow-sm">
	<div class="flex-none">
		<i class="fa-duotone fa-podium ml-6 text-4xl"></i>
	</div>
	<div class="flex-1">
		<a class="btn btn-ghost ml-4 text-xl" href={resolve('/(pages)')}>MUNify CHASE</a>
	</div>
	<div class="flex-none flex items-center gap-2">
		<a
			class="btn btn-ghost"
			href={resolve('/app/[conferenceId]/mission-control', { conferenceId: LOCAL_CONFERENCE_ID })}
		>
			<i class="fa-duotone fa-cloud-slash mr-2 text-xl"></i>
			{m.tryOfflineDemo()}
		</a>
		<a class="btn btn-ghost" href={resolve('/app')}>
			<i class="fa-duotone fa-right-to-bracket mr-2 text-xl"></i>
			{m.login()}
		</a>
	</div>
</div>
