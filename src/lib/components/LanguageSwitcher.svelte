<script lang="ts">
	import { locales, getLocale, cookieName, cookieMaxAge } from '$lib/paraglide/runtime';
	import Modal from './Modal.svelte';
	import Flag from './Flag.svelte';
	import { m } from '$lib/paraglide/messages';

	const localeInfo: Record<string, { flag: string; label: string }> = {
		de: { flag: 'de', label: 'Deutsch' },
		en: { flag: 'gb', label: 'English' },
		pt: { flag: 'pt', label: 'Português' }
	};

	let modalOpen = $state(false);

	function switchLocale(locale: string) {
		document.cookie = `${cookieName}=${locale}; path=/; max-age=${cookieMaxAge}; domain=${window.location.hostname}; SameSite=Lax`;
		window.location.reload();
	}
</script>

<button class="btn btn-lg relative min-h-10 flex-1 text-2xl" onclick={() => (modalOpen = true)}>
	<Flag size="xs" representation={{ alpha2Code: localeInfo[getLocale()]?.flag }} />
</button>

<Modal bind:open={modalOpen}>
	<h3 class="mb-4 text-lg font-bold">
		<i class="fa-solid fa-earth-europe mr-2"></i>{m.language()}
	</h3>
	<div class="flex flex-col gap-2">
		{#each locales as l (l)}
			<button
				class="btn btn-lg justify-start gap-4 text-lg {getLocale() === l ? 'btn-active' : ''}"
				onclick={() => switchLocale(l)}
			>
				<Flag size="xs" representation={{ alpha2Code: localeInfo[l]?.flag }} />
				{localeInfo[l]?.label ?? l}
			</button>
		{/each}
	</div>
</Modal>
