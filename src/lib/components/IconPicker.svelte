<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { Popover } from 'bits-ui';

	interface Props {
		/** Selected Phosphor icon name, without the `ph-` prefix */
		value?: string | null;
		/** Icon shown when no value is set */
		fallback?: string;
		/** Called with the picked icon name */
		onchange?: (icon: string) => void;
		triggerClass?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(),
		fallback = 'flag',
		onchange,
		triggerClass = 'btn btn-sm',
		disabled = false
	}: Props = $props();

	type CatalogEntry = { name: string; search: string };

	const MAX_RESULTS = 120;

	let open = $state(false);
	let query = $state('');
	let catalog = $state<CatalogEntry[]>();
	let catalogPromise: Promise<void> | undefined;

	// The catalog with names and tags is only needed while picking, so it is
	// loaded on first open instead of shipping with every page.
	function loadCatalog() {
		catalogPromise ??= import('@phosphor-icons/core').then(({ icons }) => {
			catalog = icons.map((icon) => ({
				name: icon.name,
				search: [icon.name, ...icon.tags].join(' ').toLowerCase()
			}));
		});
		return catalogPromise;
	}

	const matches = $derived.by(() => {
		if (!catalog) return [];
		const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return catalog;
		return catalog.filter((entry) => terms.every((term) => entry.search.includes(term)));
	});

	function pick(name: string) {
		value = name;
		onchange?.(name);
		open = false;
	}

	const contentClass =
		// fallow-ignore-next-line css-token-drift -- must stack above daisyUI's modal (999)
		'card bg-base-100 border-base-300 z-[1000] w-80 max-w-[calc(100vw-2rem)] border p-3 shadow-lg';
</script>

<Popover.Root
	bind:open
	onOpenChange={(isOpen) => {
		if (isOpen) {
			query = '';
			loadCatalog();
		}
	}}
>
	<Popover.Trigger
		class={triggerClass}
		{disabled}
		aria-label={m.iconPickerChoose()}
		title={value ?? fallback}
	>
		<i aria-hidden="true" class="ph-fill ph-{value || fallback}"></i>
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content sideOffset={8} class={contentClass}>
			<label class="input input-bordered input-sm mb-2 w-full">
				<i aria-hidden="true" class="ph-duotone ph-magnifying-glass opacity-60"></i>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="search" bind:value={query} placeholder={m.iconPickerSearch()} autofocus />
			</label>
			{#if !catalog}
				<div class="flex justify-center p-6">
					<span class="loading loading-spinner"></span>
				</div>
			{:else if matches.length === 0}
				<p class="text-base-content/60 p-4 text-center text-sm">{m.noResults()}</p>
			{:else}
				<div class="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto">
					{#each matches.slice(0, MAX_RESULTS) as entry (entry.name)}
						<button
							type="button"
							class="btn btn-ghost btn-sm btn-square text-lg {entry.name === value
								? 'btn-active text-primary'
								: ''}"
							title={entry.name}
							aria-label={entry.name}
							onclick={() => pick(entry.name)}
						>
							<i aria-hidden="true" class="ph-fill ph-{entry.name}"></i>
						</button>
					{/each}
				</div>
				<p class="text-base-content/60 mt-2 text-xs">
					{#if matches.length > MAX_RESULTS}
						{m.iconPickerShowingFirst({ count: MAX_RESULTS, total: matches.length })}
					{:else}
						{value || fallback}
					{/if}
				</p>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
