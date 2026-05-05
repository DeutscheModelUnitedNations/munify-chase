<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { deriveStatus, formatDateRange } from '$lib/helpers/launcher';
	import LauncherFlag from './LauncherFlag.svelte';
	import StatusDot from './StatusDot.svelte';
	import CommitteeStack from './CommitteeStack.svelte';
	import type { LauncherConference } from './types';

	interface Props {
		conference: LauncherConference;
		onDelete: (c: { id: string; title: string }) => void;
	}

	let { conference, onDelete }: Props = $props();

	const status = $derived(deriveStatus(conference));
	const dateRange = $derived(formatDateRange(conference, getLocale()));

	function handleRowClick() {
		goto(conference.href);
	}

	function handleConfigure(e: MouseEvent) {
		e.stopPropagation();
		goto(`/app/${conference.id}/mission-control/config`);
	}

	function handleDelete(e: MouseEvent) {
		e.stopPropagation();
		onDelete({ id: conference.id, title: conference.title });
		(document.activeElement as HTMLElement | null)?.blur();
	}
</script>

<div
	class="border-base-content/10 hover:bg-primary/5 grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-4 py-3 transition-colors"
	role="button"
	tabindex="0"
	onclick={handleRowClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleRowClick();
		}
	}}
>
	<LauncherFlag role={conference.role} representation={conference.representation} size={32} />

	<div class="flex min-w-0 flex-col gap-1">
		<div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
			<h4 class="m-0 min-w-0 truncate text-base font-bold">{conference.title}</h4>
			{#if dateRange || conference.location}
				<span class="text-base-content/60 text-xs">
					{[dateRange, conference.location].filter(Boolean).join(' · ')}
				</span>
			{/if}
		</div>
		{#if conference.committees.length > 0}
			<div class="min-w-0">
				<CommitteeStack committees={conference.committees} max={6} size="sm" />
			</div>
		{/if}
	</div>

	<StatusDot {status} />

	<div class="flex gap-1" onclick={(e) => e.stopPropagation()} role="presentation">
		<button
			type="button"
			class="btn btn-ghost btn-sm btn-circle"
			aria-label={m.launcherConfigure()}
			title={m.launcherConfigure()}
			onclick={handleConfigure}
		>
			<i class="fa-duotone fa-gear"></i>
		</button>
		<div class="dropdown dropdown-end">
			<button
				type="button"
				tabindex="0"
				class="btn btn-ghost btn-sm btn-circle"
				aria-label={m.launcherMore()}
				title={m.launcherMore()}
			>
				<i class="fa-duotone fa-ellipsis"></i>
			</button>
			<ul
				tabindex="-1"
				class="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-44 p-2 shadow-lg"
			>
				<li>
					<button type="button" class="text-error" onclick={handleDelete}>
						<i class="fa-duotone fa-trash-can"></i>
						{m.launcherDelete()}
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>
