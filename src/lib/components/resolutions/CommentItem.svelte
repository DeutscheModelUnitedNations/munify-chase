<script lang="ts">
	import type { ComponentProps, Snippet } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';

	interface Props {
		name: string;
		representation: ComponentProps<typeof Flag>['representation'];
		content: string;
		teamOnly: boolean;
		canDelete: boolean;
		ondelete: () => void;
		/** A reply: indented, smaller, without the team-only badge. */
		reply?: boolean;
		children?: Snippet;
	}

	let {
		name,
		representation,
		content,
		teamOnly,
		canDelete,
		ondelete,
		reply = false,
		children
	}: Props = $props();
</script>

<div
	class={reply ? 'mt-2 ml-4 border-l-2 pl-2' : 'bg-base-100 rounded-lg border-l-2 p-4'}
	class:border-warning={teamOnly}
	class:border-transparent={!teamOnly && !reply}
	class:border-base-300={!teamOnly && reply}
>
	<div class="flex items-start justify-between gap-2">
		<div class="flex items-center gap-2.5">
			{#if representation}
				<Flag size="xs" {representation} />
			{/if}
			<span class="{reply ? 'text-xs' : 'text-sm'} font-semibold">{name}</span>
		</div>
		<div class="flex items-center gap-1">
			{#if teamOnly && !reply}
				<span class="badge badge-xs badge-warning" title={m.teamOnly()}>
					<i aria-hidden="true" class="ph-fill ph-shield-star"></i>
				</span>
			{/if}
			{#if canDelete}
				<button class="btn btn-ghost btn-xs" aria-label={m.delete()} onclick={ondelete}>
					<i aria-hidden="true" class="ph-fill ph-trash text-error"></i>
				</button>
			{/if}
		</div>
	</div>
	<p class="{reply ? 'mt-1.5 text-xs' : 'mt-2 text-sm'} whitespace-pre-wrap">{content}</p>
	{@render children?.()}
</div>
