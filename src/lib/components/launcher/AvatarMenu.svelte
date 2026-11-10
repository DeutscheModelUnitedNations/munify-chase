<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '#lib/paraglide/messages';
	import { clearTokens } from '#lib/platform/oidc';
	import { userInitials } from '#lib/components/initials';

	interface Props {
		givenName?: string | null;
		familyName?: string | null;
		email?: string | null;
	}

	let { givenName = null, familyName = null, email = null }: Props = $props();

	const initials = $derived(userInitials({ givenName, familyName, email }));

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
			<a href="https://delegator.munify.cloud/my-account" target="_blank" rel="noopener noreferrer">
				<i aria-hidden="true" class="ph-duotone ph-user"></i>
				{m.myDelegatorAccount()}
				<i class="ph-fill ph-arrow-up-right text-base-content/50 text-xs" aria-hidden="true"></i>
			</a>
		</li>
		<li>
			<button
				onclick={() => {
					clearTokens();
					goto('/');
				}}
			>
				<i aria-hidden="true" class="ph-duotone ph-sign-out"></i>
				{m.launcherSignOut()}
			</button>
		</li>
	</ul>
</div>
