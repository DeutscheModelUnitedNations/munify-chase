<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';

	interface Item {
		key?: string;
		faIcon: string;
		title: string;
		href: string;
		active?: boolean;
	}

	interface Props {
		items: Item[];
		tools?: Snippet;
		CustomListItems?: Snippet;
		user?: { name?: string; email?: string; givenName?: string; familyName?: string } | null;
		roleLabel?: string;
		roleBadgeClass?: string;
		conferenceTitle?: string | null;
		signOutHref?: string;
		dashboardHref?: string;
	}

	let {
		items,
		tools,
		CustomListItems,
		user,
		roleLabel,
		roleBadgeClass = 'badge-ghost',
		conferenceTitle,
		signOutHref,
		dashboardHref
	}: Props = $props();

	let menuVisible = $state(false);

	const toolsSnippet = $derived(tools ?? CustomListItems);
	const displayName = $derived(user?.name?.trim() || user?.email?.trim() || '');

	const initials = $derived.by(() => {
		const first = user?.givenName?.trim()?.[0] ?? '';
		const last = user?.familyName?.trim()?.[0] ?? '';
		const both = `${first}${last}`.toUpperCase();
		if (both) return both;
		const fromName = user?.name?.trim()?.[0]?.toUpperCase();
		if (fromName) return fromName;
		return user?.email?.trim()?.[0]?.toUpperCase() ?? '?';
	});
</script>

{#if user}
	<button
		class="from-primary to-primary/70 grid size-8 cursor-pointer place-items-center rounded-full bg-gradient-to-br text-xs font-bold tracking-wide text-white"
		aria-label={displayName || 'Open menu'}
		title={displayName || undefined}
		aria-haspopup="menu"
		aria-expanded={menuVisible}
		type="button"
		onclick={() => (menuVisible = true)}
	>
		{initials}
	</button>
{:else}
	<button
		class="btn btn-circle btn-ghost"
		aria-label="Open menu"
		aria-haspopup="menu"
		aria-expanded={menuVisible}
		type="button"
		onclick={() => (menuVisible = true)}
	>
		<i class="fa-duotone fa-bars"></i>
	</button>
{/if}

{#if menuVisible}
	<div
		class="bg-base-100 rounded-box absolute top-5 right-5 z-50 flex w-64 flex-col shadow-md"
		in:fly={{ y: -10 }}
		out:fly={{ y: -10 }}
	>
		{#if displayName}
			<div class="flex flex-col gap-1 px-4 pt-4 pb-3">
				<span class="sr-only">{m.signedInAs()}</span>
				<span class="text-base font-semibold leading-tight">{displayName}</span>
				<div class="flex flex-wrap items-center gap-2">
					{#if roleLabel}
						<span class="badge badge-sm {roleBadgeClass}">{roleLabel}</span>
					{/if}
					{#if conferenceTitle}
						<span class="text-base-content/70 truncate text-xs">{conferenceTitle}</span>
					{/if}
				</div>
			</div>
			<div class="divider my-0"></div>
		{/if}

		<ul class="menu w-full p-2">
			{#if items.length > 0}
				<li class="menu-title">{m.navigation()}</li>
				{#each items as item (item.key ?? item.href)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is resolved by caller -->
						<a
							href={item.href}
							class={item.active ? 'menu-active font-semibold' : ''}
							aria-current={item.active ? 'page' : undefined}
						>
							<i
								class="{item.active ? 'fas' : 'fa-duotone'} w-6 text-center fa-{item.faIcon.replace(
									'fa-',
									''
								)}"
							></i>
							<span class="flex-1">{item.title}</span>
							{#if item.active}
								<i class="fa-solid fa-circle text-primary text-[0.5rem]" aria-hidden="true"></i>
							{/if}
						</a>
					</li>
				{/each}
			{/if}

			{#if toolsSnippet}
				<li class="menu-title mt-2">{m.tools()}</li>
				{@render toolsSnippet()}
			{/if}

			{#if dashboardHref}
				{#if items.length > 0 || toolsSnippet}
					<li>
						<div class="divider my-1"></div>
					</li>
				{/if}
				<li>
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- fixed app-level route -->
					<a href={dashboardHref}>
						<i class="fa-duotone fa-grid-2 w-6 text-center"></i>
						<span class="flex-1">{m.dashboard()}</span>
						<i class="fa-duotone fa-arrow-up-right text-base-content/50" aria-hidden="true"></i>
					</a>
				</li>
			{/if}
		</ul>

		<div class="divider my-0"></div>

		<div class="flex w-full gap-1 px-2 py-2">
			<ThemeSwitcher />
			<LanguageSwitcher />
		</div>

		{#if signOutHref}
			<div class="divider my-0"></div>
			<ul class="menu w-full p-2">
				<li>
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- fixed app-level route -->
					<a href={signOutHref} class="btn btn-sm btn-soft btn-error justify-start">
						<i class="fas fa-arrow-right-from-bracket w-6 text-center"></i>
						{m.launcherSignOut()}
					</a>
				</li>
			</ul>
		{/if}
	</div>
{/if}

{#if menuVisible}
	<button
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		type="button"
		class="fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-brightness-50"
		aria-label="Close menu"
		onclick={() => (menuVisible = false)}
	></button>
{/if}
