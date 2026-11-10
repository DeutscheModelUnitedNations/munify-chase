<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '#lib/paraglide/messages';

	interface Props {
		conferenceId: string;
		committeeId: string;
	}

	let { conferenceId, committeeId }: Props = $props();
</script>

<a
	data-tour="committee.resolutions"
	class="card bg-base-100 shadow-sm transition hover:shadow-md"
	href={resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
		conferenceId,
		committeeId
	})}
>
	<div class="card-body flex-row items-center gap-3 p-4">
		<i aria-hidden="true" class="ph-duotone ph-file-text text-2xl"></i>
		<div class="flex-1">
			<h2 class="card-title text-lg">{m.resolutions()}</h2>
			<p class="text-base-content/60 text-sm">{m.resolutionsCardHint()}</p>
		</div>
		<i aria-hidden="true" class="ph-fill ph-caret-right opacity-50"></i>
	</div>
</a>
