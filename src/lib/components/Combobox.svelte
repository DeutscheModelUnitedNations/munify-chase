<script lang="ts" generics="T">
	import { m } from '$lib/paraglide/messages';
	import { Combobox } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Kbd from './Kbd.svelte';

	interface Props {
		value: string;
		options: T[];
		focused?: boolean;
		placeholder?: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
		kbd?: string;
		triggerClass?: string;
		filter: (option: T[], value: string) => T[];
		getStringValue: (value: T) => string;
		/** Unique key per option for the {#each} block. Defaults to getStringValue but must be overridden when multiple options can share the same display name. */
		getKey?: (option: T) => string | number;
		ListItem: Snippet<[T]>;
		AdditionalButtons?: Snippet;
		submit?: (value?: string) => void;
	}

	let {
		value = $bindable(),
		options,
		focused = $bindable(),
		placeholder,
		side,
		kbd,
		triggerClass = 'btn btn-square input-lg join-item',
		filter,
		getStringValue,
		getKey,
		ListItem,
		AdditionalButtons,
		submit
	}: Props = $props();

	let filteredOptions: T[] = $derived(filter(options, value));

	let input: HTMLInputElement | undefined;
	// open is tracked separately so we can open the dropdown when the user focuses the text input
	let open = $state(false);

	$effect(() => {
		if (focused && input) {
			input.focus();
		}
	});
</script>

<Combobox.Root type="single" bind:value bind:open>
	<div class="join">
		<Combobox.Trigger class={triggerClass}>
			<i class="fas fa-magnifying-glass"></i>
		</Combobox.Trigger>
		<Combobox.Input>
			{#snippet child({ props })}
				<label class="input input-lg join-item w-full flex-1" {...props}>
					<input
						bind:focused
						bind:this={input}
						{placeholder}
						aria-label={placeholder}
						onfocus={() => {
							open = true;
						}}
						oninput={(e) => {
							value = (e.target as HTMLInputElement).value;
						}}
						bind:value
						onkeydown={(e) => {
							if (e.key === 'Escape') {
								focused = false;
								value = '';
								open = false;
								(e.target as HTMLInputElement).blur();
							} else if (e.key === 'Enter' && submit) {
								submit(value);
							}
						}}
					/>
					{#if kbd && !focused}
						<Kbd hotkey={kbd} />
					{:else if kbd}
						<Kbd hotkey="esc" />
					{/if}
				</label>
			{/snippet}
		</Combobox.Input>
		{#if AdditionalButtons}
			{@render AdditionalButtons()}
		{/if}
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="bg-base-100 border-base-300 shadow-popover card z-[1000] max-h-60 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] border px-1 py-3 shadow-lg outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
			sideOffset={10}
			{side}
		>
			<Combobox.ScrollUpButton class="flex w-full justify-center py-1">
				<i class="fas fa-caret-up"></i>
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="p-1">
				{#each filteredOptions as option (getKey ? getKey(option) : getStringValue(option))}
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
