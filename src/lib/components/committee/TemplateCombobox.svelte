<script lang="ts">
	import Combobox from '../Combobox.svelte';

	interface Props {
		value: string;
		/** Texts offered to pick from; anything else can be typed in. */
		templates: string[];
		placeholder: string;
		/** Phosphor icon in front of each template. */
		icon: string;
	}

	let { value = $bindable(), templates, placeholder, icon }: Props = $props();

	const options = $derived(templates.map((template) => ({ label: template })));
</script>

<Combobox
	bind:value
	{options}
	side="top"
	{placeholder}
	getStringValue={({ label }) => label}
	filter={(options, v) =>
		options.filter(({ label }) => label.toLowerCase().includes(v.toLowerCase()))}
>
	{#snippet ListItem(option)}
		<div class="flex items-center gap-2">
			<i aria-hidden="true" class="ph-fill ph-{icon}"></i>
			<span>{option.label}</span>
		</div>
	{/snippet}

	{#snippet AdditionalButtons()}
		<button
			class="btn btn-square input-lg join-item"
			aria-label="Clear selection"
			onclick={() => (value = '')}
		>
			<i aria-hidden="true" class="ph-fill ph-trash"></i>
		</button>
	{/snippet}
</Combobox>
