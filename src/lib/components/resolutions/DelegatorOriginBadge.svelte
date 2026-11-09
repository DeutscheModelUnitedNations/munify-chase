<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	/** Where a draft taken over from DELEGATOR stands: still following it, or CHASE's own. */
	interface Props {
		delegatorVersion: number | null | undefined;
		detached: boolean;
	}

	let { delegatorVersion, detached }: Props = $props();
</script>

{#if delegatorVersion != null}
	<div
		class="badge badge-sm badge-ghost gap-1"
		title={detached ? m.paperFromDelegatorDetachedHint() : m.paperFromDelegatorFollowingHint()}
	>
		<i aria-hidden="true" class="ph-fill ph-link"></i>
		{m.paperFromDelegator({ version: delegatorVersion })}
	</div>
{/if}
