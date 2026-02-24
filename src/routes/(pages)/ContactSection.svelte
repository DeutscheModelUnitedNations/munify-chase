<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { configPublic } from '$config/public';
</script>

{#if configPublic.PUBLIC_CONTACT_EMAIL}
	<div class="flex flex-col items-center gap-6 p-4 pb-20 lg:p-20">
		<h1
			class="text-center font-serif text-3xl leading-tight font-bold text-slate-900 lg:text-4xl dark:text-white"
		>
			{m.homeContactTitle()}
		</h1>
		<p
			class="text-md max-w-3xl text-center leading-normal text-slate-900 lg:text-lg dark:text-white"
		>
			{m.homeContactText()}
		</p>
		<a class="btn btn-primary mt-2" href="mailto:{configPublic.PUBLIC_CONTACT_EMAIL}">
			<i class="fas fa-envelope mr-2"></i>
			{m.homeContactButton()}
		</a>
	</div>
{/if}
