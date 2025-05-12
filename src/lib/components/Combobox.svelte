<script lang="ts" generics="T">
	import { m } from '$lib/paraglide/messages';
	import { Combobox } from 'bits-ui';
	import type { Snippet } from 'svelte';

	interface Props {
		value: string;
		options: T[];
		focused?: boolean;
		placeholder?: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
		kbd?: string;
		filter: (option: T[], value: string) => T[];
		getStringValue: (value: T) => string;
		ListItem: Snippet<[T]>;
		AdditionalButtons?: Snippet;
	}

	let {
		value = $bindable(),
		options,
		focused = $bindable(),
		placeholder,
		side,
		kbd,
		filter,
		getStringValue,
		ListItem,
		AdditionalButtons
	}: Props = $props();

	let filteredOptions: T[] = $derived(filter(options, value));
</script>

<Combobox.Root type="single" bind:value>
	<div class="join">
		<Combobox.Input>
			{#snippet child({ props })}
				<input
					bind:focused
					class="input input-lg join-item w-full flex-1"
					{placeholder}
					aria-label={placeholder}
					oninput={(e) => {
						value = e.target.value;
					}}
					bind:value
					{...props}
				/>
			{/snippet}
		</Combobox.Input>
		<Combobox.Trigger class="btn btn-square input-lg join-item">
			<i class="fas fa-magnifying-glass"></i>
		</Combobox.Trigger>
		{#if AdditionalButtons}
			{@render AdditionalButtons()}
		{/if}
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="bg-base-100 border-base-300 shadow-popover card z-30 max-h-60 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] border px-1 py-3 shadow-lg outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={10}
			{side}
		>
			<Combobox.ScrollUpButton class="flex w-full justify-center py-1">
				<i class="fas fa-caret-up"></i>
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="p-1">
				{#each filteredOptions as option, i}
					<Combobox.Item
						class="hover:bg-base-200 active:bg-base-300 data-highlighted:bg-base-300 flex w-full cursor-pointer items-center rounded-md py-3 pl-5 text-sm outline-hidden transition-all duration-200 select-none"
						value={getStringValue(option)}
						label={getStringValue(option)}
						onclick={() => {
							value = getStringValue(option);
						}}
					>
						{@render ListItem(option)}
					</Combobox.Item>
				{:else}
					<div
						class="btn btn-ghost flex h-10 w-full py-3 pl-5 text-sm outline-hidden select-none btn-disabled"
					>
						{m.noResults()}
					</div>
				{/each}
			</Combobox.Viewport>
			<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1">
				<i class="fas fa-caret-down"></i>
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
