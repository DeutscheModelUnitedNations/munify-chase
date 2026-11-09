<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { LauncherBadge } from '#lib/helpers/launcher';

	interface Props {
		role: LauncherBadge;
		detail?: string | null;
	}

	let { role, detail = null }: Props = $props();

	const ROLE_BADGES: Record<LauncherBadge, () => { label: string; icon: string; variant: string }> =
		{
			ADMIN: () => ({
				label: m.launcherRoleAdmin(),
				icon: 'shield-check',
				variant: 'badge-neutral'
			}),
			CHAIR: () => ({ label: m.launcherRoleChair(), icon: 'gavel', variant: 'badge-accent' }),
			SPECTATOR: () => ({ label: m.launcherRoleSpectator(), icon: 'eye', variant: 'badge-ghost' }),
			DELEGATE: () => ({ label: m.launcherRoleDelegate(), icon: 'flag', variant: 'badge-primary' })
		};

	const config = $derived((ROLE_BADGES[role] ?? ROLE_BADGES.DELEGATE)());
</script>

<div class="badge badge-soft {config.variant} text-base-content gap-1.5 whitespace-nowrap py-3">
	<i aria-hidden="true" class="ph-duotone ph-{config.icon}"></i>
	<span class="font-semibold">{config.label}</span>
	{#if detail}
		<span class="font-medium opacity-65">· {detail}</span>
	{/if}
</div>
