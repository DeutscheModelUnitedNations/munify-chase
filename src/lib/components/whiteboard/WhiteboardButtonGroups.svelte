<script lang="ts" module>
	export interface WhiteboardButton {
		label: string;
		icon: string;
		command: () => void;
		active?: () => boolean;
	}
</script>

<script lang="ts">
	interface Props {
		buttonGroups: WhiteboardButton[][];
		/** Classes of the card around the groups */
		class?: string;
		/** Extra tooltip classes, such as its placement */
		tooltipClass?: string;
	}

	let { buttonGroups, class: className = '', tooltipClass = '' }: Props = $props();
</script>

<div class="card bg-base-300 flex flex-row flex-nowrap gap-2 p-2 shadow-sm {className}">
	{#each buttonGroups as group, groupIdx (groupIdx)}
		<div class="join">
			{#each group as button (button.label)}
				<div class="tooltip {tooltipClass}" data-tip={button.label}>
					<button
						class="btn btn-sm join-item {button.active && button.active() ? 'btn-active' : ''}"
						aria-label={button.label}
						onclick={() => button.command()}
					>
						<i aria-hidden="true" class={`ph-duotone ph-${button.icon}`}></i>
					</button>
				</div>
			{/each}
		</div>
	{/each}
</div>
