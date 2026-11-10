<script lang="ts">
	interface Props {
		label: string;
		/** A paper is being created right now */
		creating: boolean;
		/** Papers are filed under the active agenda item, so there must be one */
		hasAgendaItem: boolean;
		onclick: () => void;
		'data-tour'?: string;
	}

	let { label, creating, hasAgendaItem, onclick, 'data-tour': tour }: Props = $props();
</script>

<button class="btn btn-primary" data-tour={tour} disabled={creating || !hasAgendaItem} {onclick}>
	{#if creating}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{:else}<i
			aria-hidden="true"
			class="ph-fill ph-plus"
		></i>{/if}
	{label}
</button>
