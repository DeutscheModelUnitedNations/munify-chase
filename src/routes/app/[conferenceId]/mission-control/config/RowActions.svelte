<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		onEdit: () => void;
		onDelete: () => void;
		deleteLabel: string;
		/** Locks both buttons, explained in their tooltips */
		lockedReason?: string | null;
	}
	let { onEdit, onDelete, deleteLabel, lockedReason }: Props = $props();

	// Rows that can be locked always explain their buttons in a tooltip
	let titled = $derived(lockedReason !== undefined);
	let locked = $derived(!!lockedReason);
</script>

<div class="flex gap-1">
	<button
		class="btn btn-ghost btn-sm"
		onclick={onEdit}
		aria-label={m.edit()}
		disabled={locked}
		title={titled ? (lockedReason ?? m.edit()) : undefined}
	>
		<i aria-hidden="true" class="ph-fill ph-pen text-sm"></i>
	</button>
	<button
		class="btn btn-ghost btn-sm text-error"
		onclick={onDelete}
		aria-label={deleteLabel}
		disabled={locked}
		title={titled ? (lockedReason ?? deleteLabel) : undefined}
	>
		<i aria-hidden="true" class="ph-fill ph-trash text-sm"></i>
	</button>
</div>
