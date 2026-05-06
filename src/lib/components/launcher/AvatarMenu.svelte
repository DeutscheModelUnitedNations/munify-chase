<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	interface Props {
		givenName?: string | null;
		familyName?: string | null;
		email?: string | null;
	}

	let { givenName = null, familyName = null, email = null }: Props = $props();

	const initials = $derived.by(() => {
		const first = givenName?.trim()?.[0] ?? '';
		const last = familyName?.trim()?.[0] ?? '';
		const both = `${first}${last}`.toUpperCase();
		if (both) return both;
		return email?.trim()?.[0]?.toUpperCase() ?? '?';
	});

	const fullName = $derived(
		[givenName, familyName].filter(Boolean).join(' ').trim() || (email ?? '')
	);
</script>

<div class="dropdown dropdown-end">
	<button
		tabindex="0"
		class="from-primary to-primary/70 grid size-8 cursor-pointer place-items-center rounded-full bg-gradient-to-br text-xs font-bold tracking-wide text-white"
		aria-label={fullName || undefined}
		title={fullName || undefined}
		type="button"
	>
		{initials}
	</button>
	<ul
		tabindex="-1"
		class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-56 p-2 shadow-lg"
	>
		<li class="menu-title">
			<div class="flex flex-col gap-0.5">
				{#if fullName}
					<span class="text-base-content text-sm font-semibold">{fullName}</span>
				{/if}
				{#if email}
					<span class="text-base-content/60 text-xs font-normal">{email}</span>
				{/if}
			</div>
		</li>
		<li>
			<a href="/logout">
				<i class="fa-duotone fa-arrow-right-from-bracket"></i>
				{m.launcherSignOut()}
			</a>
		</li>
	</ul>
</div>
