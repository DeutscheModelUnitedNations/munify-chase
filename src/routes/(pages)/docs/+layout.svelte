<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { docsNav } from '$lib/docs/nav';
	import { m } from '$lib/paraglide/messages';

	let { data, children } = $props();

	const current = $derived((page.params.slug ?? '').replace(/\/+$/, ''));

	function docHref(slug: string) {
		return resolve('/(pages)/docs/[...slug]', { slug });
	}
</script>

<div class="drawer lg:drawer-open mx-auto max-w-[1200px] px-4 md:px-12">
	<input id="docs-drawer" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content min-w-0 pb-16 lg:pl-10">
		<label for="docs-drawer" class="btn btn-sm btn-ghost mb-4 lg:hidden">
			<i class="fa-duotone fa-bars"></i>
			{m.docsMenu()}
		</label>
		{@render children()}
	</div>

	<div class="drawer-side z-40 lg:z-auto">
		<label for="docs-drawer" aria-label={m.close()} class="drawer-overlay"></label>
		<nav
			class="bg-base-100 min-h-full w-72 p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:min-h-0 lg:overflow-y-auto lg:p-0"
			aria-label={m.homeDocsTitle()}
		>
			<ul class="menu w-full p-0">
				{#each docsNav as entry (typeof entry === 'string' ? entry : entry.slug)}
					{#if typeof entry === 'string'}
						<li>
							<a href={docHref(entry)} class={current === entry ? 'menu-active' : ''}>
								{data.titles[entry] ?? entry}
							</a>
						</li>
					{:else}
						<li>
							<details open={current === entry.slug || current.startsWith(`${entry.slug}/`)}>
								<summary>{entry.label()}</summary>
								<ul>
									<li>
										<a
											href={docHref(entry.slug)}
											class={current === entry.slug ? 'menu-active' : ''}
										>
											{m.docsOverview()}
										</a>
									</li>
									{#each entry.items as item (item)}
										<li>
											<a href={docHref(item)} class={current === item ? 'menu-active' : ''}>
												{data.titles[item] ?? item}
											</a>
										</li>
									{/each}
								</ul>
							</details>
						</li>
					{/if}
				{/each}
			</ul>
		</nav>
	</div>
</div>
