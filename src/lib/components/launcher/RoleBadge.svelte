<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LauncherBadge } from '$lib/helpers/launcher';

	interface Props {
		role: LauncherBadge;
		detail?: string | null;
	}

	let { role, detail = null }: Props = $props();

	const config = $derived.by(() => {
		switch (role) {
			case 'ADMIN':
				return { label: m.launcherRoleAdmin(), icon: 'shield-halved', variant: 'badge-neutral' };
			case 'CHAIR':
				return { label: m.launcherRoleChair(), icon: 'gavel', variant: 'badge-accent' };
			case 'SPECTATOR':
				return { label: m.launcherRoleSpectator(), icon: 'eye', variant: 'badge-ghost' };
			case 'DELEGATE':
			default:
				return { label: m.launcherRoleDelegate(), icon: 'flag', variant: 'badge-primary' };
		}
	});
</script>

<div class="badge badge-soft {config.variant} text-base-content gap-1.5 whitespace-nowrap py-3">
	<i class="fa-duotone fa-{config.icon}"></i>
	<span class="font-semibold">{config.label}</span>
	{#if detail}
		<span class="font-medium opacity-65">· {detail}</span>
	{/if}
</div>
