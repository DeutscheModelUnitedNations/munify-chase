<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LauncherStatus } from '$lib/helpers/launcher';

	interface Props {
		status: LauncherStatus;
	}

	let { status }: Props = $props();

	const config = $derived.by(() => {
		switch (status) {
			case 'active':
				return {
					label: m.launcherStatusActive(),
					dot: 'bg-success ring-success/25 ring-3'
				};
			case 'upcoming':
				return { label: m.launcherStatusUpcoming(), dot: 'bg-warning' };
			case 'past':
			default:
				return { label: m.launcherStatusPast(), dot: 'bg-base-content/40' };
		}
	});
</script>

<div
	class="text-base-content/70 inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium"
>
	<span class="block size-2 shrink-0 rounded-full {config.dot}"></span>
	{config.label}
</div>
