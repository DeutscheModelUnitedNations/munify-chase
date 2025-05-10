<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Combobox } from 'bits-ui';

	export interface Options {
		label: string;
		faIcon?: string;
	}

	interface Props {
		value: string;
		options: Options[];
		placeholder?: string;
		side?: 'top' | 'bottom' | 'left' | 'right';
	}

	let { value = $bindable(), placeholder, options, side }: Props = $props();

	const filteredOptions = $derived(
		value === ''
			? options
			: options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()))
	);

	function getValue() {
		return value;
	}

	function setValue(newValue: string) {
		value = newValue;
	}
</script>

<Combobox.Root type="single" bind:value={getValue, setValue}>
	<div class="join">
		<Combobox.Input>
			{#snippet child({ props })}
				<input
					class="input input-lg join-item w-full flex-1"
					{placeholder}
					aria-label={placeholder}
					oninput={(e) => {
						setValue(e.target.value);
					}}
					bind:value
					{...props}
				/>
			{/snippet}
		</Combobox.Input>
		<button
			class="btn btn-square input-lg join-item"
			aria-label="Clear selection"
			onclick={() => setValue('')}
		>
			<i class="fas fa-trash"></i>
		</button>
		<Combobox.Trigger class="btn btn-square input-lg join-item">
			<i class="fas fa-magnifying-glass"></i>
		</Combobox.Trigger>
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
				{#each filteredOptions as option, i (i + option.label)}
					<Combobox.Item
						class="hover:bg-base-200 active:bg-base-300 flex w-full cursor-pointer rounded-md py-3 pl-5 text-sm outline-hidden transition-all duration-200 select-none"
						value={option.label}
						label={option.label}
						onclick={() => {
							setValue(option.label);
						}}
					>
						{#if option.faIcon}
							<i class={`fa-solid fa-${option.faIcon} mr-2`}></i>
						{/if}
						{option.label}
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
