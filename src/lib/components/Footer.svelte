<script lang="ts">
	import { resolve } from '$app/paths';
	import dmunLogo from '$assets/dmunlogo/logo.png';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import ExternalLink from './ExternalLink.svelte';
</script>

<div class="w-full p-4">
	<footer
		class="footer footer-center bg-base-100 text-base-content mt-3 flex flex-col rounded-xl p-10"
	>
		<nav class="flex flex-col flex-wrap justify-center gap-4 md:flex-row">
			<a class="link-hover link" href={resolve('/(pages)')}>{m.home()}</a>
			<ExternalLink class="link-hover link" href="https://dmun.de/impressum"
				>{@html m.imprintAndPrivacy()}</ExternalLink
			>
		</nav>
		<div class="flex">
			<ThemeSwitcher />
			<LanguageSwitcher />
		</div>
		<nav>
			<div class="grid grid-flow-col gap-4" id="socials">
				<ExternalLink href="https://www.instagram.com/dmun_ev/" aria-label="Instagram">
					<i class="fa-brands fa-instagram text-3xl"></i>
				</ExternalLink>
				<ExternalLink href="https://x.com/DMUN_eV" aria-label="X / Twitter">
					<i class="fa-brands fa-x-twitter text-3xl"></i>
				</ExternalLink>
				<ExternalLink
					href="https://www.facebook.com/deutschemodelunitednations/"
					aria-label="Facebook"
				>
					<i class="fa-brands fa-facebook text-3xl"></i>
				</ExternalLink>
				<ExternalLink href="https://www.youtube.com/user/DeutscheMUNeV" aria-label="YouTube">
					<i class="fa-brands fa-youtube text-3xl"></i>
				</ExternalLink>
				<ExternalLink href="https://github.com/deutschemodelunitednations" aria-label="GitHub">
					<i class="fa-brands fa-github text-3xl"></i>
				</ExternalLink>
			</div>
		</nav>
		<aside>
			<p>{m.aServiceBy()}</p>
			<ExternalLink href="https://dmun.de" class="transition-all duration-300 hover:scale-105">
				<img src={dmunLogo} alt="DMUN Logo" class="w-40 dark:hue-rotate-180 dark:invert" />
			</ExternalLink>
			<p>
				Copyright © {new Date().getFullYear() !== 2024 ? '2024-' : ''}{new Date().getFullYear()} - {m.allRightsReservedby()}
				Deutsche Model United Nations e.V.
			</p>
		</aside>
	</footer>
</div>

<style>
	#socials a {
		transition: transform 0.3s;
	}
	#socials a:hover {
		transform: scale(1.2);
	}
</style>
