<script lang="ts" generics="T">
	type Props = {
		tabs: {
			id: T;
			faIcon?: string;
			label?: string;
		}[];
		activeTab: T;
	};

	let { tabs, activeTab = $bindable() }: Props = $props();
</script>

<div class="tabs tabs-box" role="tablist">
	{#each tabs as tab}
		<button
			role="tab"
			class="tab flex-1 {activeTab === tab.id ? 'tab-active' : ''}"
			aria-selected={activeTab === tab.id}
			aria-label={tab.label ?? tab.faIcon}
			tabindex={activeTab === tab.id ? 0 : -1}
			onclick={() => {
				activeTab = tab.id;
			}}
		>
			{#if tab.faIcon}
				<i class="fa-solid fa-{tab.faIcon?.replace('fa-', '')}"></i>
			{/if}
			{#if tab.label}
				<span class="tab-label">{tab.label}</span>
			{/if}
		</button>
	{/each}
</div>
