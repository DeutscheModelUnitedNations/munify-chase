<script lang="ts">
	import { m } from '$lib/paraglide/messages';
</script>

<section class="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 pb-16 md:px-12 lg:pb-32">
	<div class="enter-up flex flex-col gap-3" style="--enter-delay: 650ms">
		<span class="text-accent-600 text-xs font-bold tracking-[0.08em] uppercase">
			{m.homeVideoEyebrow()}
		</span>
		<h2 class="text-primary text-[27px] leading-none font-bold">{m.homeVideoTitle()}</h2>
	</div>
	<div class="enter-up border-base-300 bg-base-200 border shadow-lg" style="--enter-delay: 700ms">
		<video
			class="block aspect-video h-auto w-full"
			controls
			playsinline
			preload="none"
			poster="/video/chase-feature.jpg"
			width="1920"
			height="1080"
			aria-label={m.homeVideoLabel()}
		>
			<source src="/video/chase-feature.webm" type="video/webm" />
			<source src="/video/chase-feature.mp4" type="video/mp4" />
			<track kind="captions" src="/video/chase-feature.en.vtt" srclang="en" label="English" />
		</video>
	</div>
</section>
