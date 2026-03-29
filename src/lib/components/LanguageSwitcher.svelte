<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';
	import Modal from './Modal.svelte';

	const localeInfo: Record<string, { flag: string; label: string }> = {
		de: { flag: 'de', label: 'Deutsch' },
		en: { flag: 'gb', label: 'English' },
		pt: { flag: 'pt', label: 'Português' }
	};

	let modalOpen = $state(false);
</script>

<button class="btn btn-lg relative min-h-10 flex-1 text-2xl" onclick={() => (modalOpen = true)}>
	<span class="fi fis fi-{localeInfo[getLocale()]?.flag}"></span>
</button>

<Modal bind:open={modalOpen}>
	<h3 class="mb-4 text-lg font-bold">Language / Sprache / Idioma</h3>
	<div class="flex flex-col gap-2">
		{#each locales as l}
			<button
				class="btn btn-lg justify-start gap-4 text-lg {getLocale() === l ? 'btn-active' : ''}"
				onclick={() => {
					window.location.href = localizeHref(page.url.pathname, { locale: l });
				}}
			>
				<span class="fi fis fi-{localeInfo[l]?.flag} text-2xl"></span>
				{localeInfo[l]?.label ?? l}
			</button>
		{/each}
	</div>
</Modal>
