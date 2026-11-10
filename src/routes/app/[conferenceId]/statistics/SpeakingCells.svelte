<script lang="ts">
	import { fmtTime, type SpeakingRow } from './conferenceStats';

	interface Props {
		row: SpeakingRow;
	}
	let { row }: Props = $props();
</script>

<td class="text-right font-mono text-sm tabular-nums">{fmtTime(row.totalSeconds)}</td>
<td class="text-right tabular-nums">{row.speechCount}</td>
<td class="text-right tabular-nums">{row.commentCount}</td>
