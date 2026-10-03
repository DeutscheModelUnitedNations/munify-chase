<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { configPublic } from '$config/public';
	import AccentStripe from '$lib/components/AccentStripe.svelte';
	import zweig from '$assets/dmunlogo/dmun-zweig-halbtransparent.svg';
</script>

{#if configPublic.PUBLIC_CONTACT_EMAIL}
	<section class="bg-neutral text-neutral-content relative overflow-hidden">
		<img
			src={zweig}
			alt=""
			aria-hidden="true"
			class="pointer-events-none absolute -top-[8%] -left-[6%] w-[44%] select-none dark:hidden"
		/>
		<div
			class="relative mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-4 py-18 text-left md:items-end md:px-12 md:text-right lg:py-32"
		>
			<AccentStripe long inverse />
			<h2 class="text-[27px] leading-none font-bold">{m.homeContactTitle()}</h2>
			<p class="max-w-[56ch] text-[15px] leading-[1.3]">{m.homeContactText()}</p>
			<a
				class="btn border-neutral-content bg-neutral-content text-neutral"
				href="mailto:{configPublic.PUBLIC_CONTACT_EMAIL}"
			>
				{m.homeContactButton()}
			</a>
			<p class="text-xs opacity-80">{configPublic.PUBLIC_CONTACT_EMAIL}</p>
		</div>
	</section>
{/if}
