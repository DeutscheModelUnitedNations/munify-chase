<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import { repLabel } from './conferenceStats';

	interface Props {
		row: { representationId: string; representationName: string | null; alpha2Code: string | null };
		truncate?: boolean;
	}
	let { row, truncate = false }: Props = $props();
</script>

<td>
	<div class="flex items-center gap-2">
		<Flag size="xs" representation={{ alpha2Code: row.alpha2Code }} />
		<span class="text-sm" class:truncate
			>{repLabel({
				name: row.representationName,
				alpha2: row.alpha2Code,
				id: row.representationId
			})}</span
		>
	</div>
</td>
