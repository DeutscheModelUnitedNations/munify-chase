<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import {
		ARCH_BUILD_URL,
		DOWNLOAD_PLATFORMS,
		INSTALL_GUIDE_URL,
		platformLabel,
		RELEASES_PAGE_URL,
		type DownloadPlatform,
		type LatestRelease
	} from '$lib/helpers/downloads';
	import SplitSection from './SplitSection.svelte';

	interface Props {
		/** Detected from the User-Agent, null on phones and unknown systems */
		platform: DownloadPlatform | null;
		release: Promise<LatestRelease | null>;
	}

	// fallow-ignore-next-line unused-component-prop -- release is read by the {#await} block
	let { platform, release }: Props = $props();

	const others = $derived(DOWNLOAD_PLATFORMS.filter((p) => p !== platform));

	const href = (p: DownloadPlatform) =>
		resolve('/download/[platform=downloadPlatform]', { platform: p });
</script>

<SplitSection id="download" title={m.homeDownloadTitle()} text={m.homeDownloadText()}>
	{#if platform}
		{@const label = platformLabel(platform)}
		<a class="btn btn-primary w-full sm:w-auto" href={href(platform)} data-sveltekit-reload>
			<i class="fa-brands {label.icon}"></i>
			{m.homeDownloadForOs({ os: label.os })}
			<span class="font-normal opacity-80">{label.format}</span>
		</a>
	{/if}

	<div class="flex flex-col items-start gap-3">
		{#if platform}
			<p class="text-sm font-bold">{m.homeDownloadOtherPlatforms()}</p>
		{/if}
		<div class="flex flex-wrap gap-2">
			{#each others as p (p)}
				{@const label = platformLabel(p)}
				<a class="btn btn-outline btn-sm" href={href(p)} data-sveltekit-reload>
					<i class="fa-brands {label.icon}"></i>
					{label.os}
					<span class="font-normal opacity-70">{label.format}</span>
				</a>
			{/each}
		</div>
	</div>

	<p class="max-w-[66ch] text-sm italic opacity-80">
		{#await release then latest}
			{#if latest}
				{m.homeDownloadVersion({ version: latest.version })}
			{/if}
		{/await}
		{m.homeDownloadUnsignedNote()}
	</p>

	<div class="flex flex-wrap gap-x-6 gap-y-2">
		<a class="link link-primary font-bold" href={INSTALL_GUIDE_URL} target="_blank">
			{m.homeDownloadInstallGuide()}
		</a>
		<a class="link link-primary font-bold" href={ARCH_BUILD_URL} target="_blank">
			{m.homeDownloadArch()}
		</a>
		<a class="link link-primary font-bold" href={RELEASES_PAGE_URL} target="_blank">
			{m.homeDownloadAllReleases()}
		</a>
	</div>
</SplitSection>
