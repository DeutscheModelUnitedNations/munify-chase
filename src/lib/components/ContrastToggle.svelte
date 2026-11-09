<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import {
		CONTRAST_STORAGE_KEY,
		contrastIsMore,
		storedContrastChoice,
		type ContrastChoice
	} from '#lib/helpers/contrast';

	// `src/app.html` already set the attribute before the first paint; this only keeps it current
	let more = $state(false);

	function readChoice(): ContrastChoice | null {
		try {
			return storedContrastChoice(localStorage.getItem(CONTRAST_STORAGE_KEY));
		} catch {
			return null;
		}
	}

	function apply(isMore: boolean) {
		more = isMore;
		if (isMore) document.documentElement.dataset.contrast = 'more';
		else delete document.documentElement.dataset.contrast;
	}

	onMount(() => {
		const system = matchMedia('(prefers-contrast: more)');
		const follow = () =>
			apply(contrastIsMore({ choice: readChoice(), systemPrefersMore: system.matches }));
		follow();
		system.addEventListener('change', follow);
		return () => system.removeEventListener('change', follow);
	});

	function toggle() {
		const choice: ContrastChoice = more ? 'normal' : 'more';
		try {
			localStorage.setItem(CONTRAST_STORAGE_KEY, choice);
		} catch {
			// Private mode: it still applies until the page is left
		}
		apply(choice === 'more');
	}
</script>

<!-- Sits between the theme and the language switch, in their shape -->
<button
	type="button"
	class="btn btn-lg flex-1 {more ? 'btn-active' : ''}"
	aria-label={m.a11yHighContrast()}
	title={m.a11yHighContrast()}
	aria-pressed={more}
	onclick={toggle}
>
	<i class="fa-duotone fa-circle-half-stroke w-6 text-center"></i>
</button>
