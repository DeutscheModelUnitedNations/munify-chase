<script lang="ts" generics="T">
	type Tab = {
		id: T;
		faIcon?: string;
		label?: string;
	};

	interface Props {
		tabs: Tab[];
		activeTab: T;
		onTabChange?: (tab: T) => void;
	}

	let { tabs, activeTab = $bindable(), onTabChange }: Props = $props();
</script>

<div class="tabs tabs-box" role="tablist">
	{#each tabs as tab}
		<button
			role="tab"
			class="tab flex-1 {activeTab === tab.id ? 'tab-active' : ''} items-center"
			aria-selected={activeTab === tab.id}
			aria-label={tab.label ?? tab.faIcon}
			tabindex={activeTab === tab.id ? 0 : -1}
			onclick={() => {
				if (activeTab === tab.id) return;
				if (onTabChange) {
					onTabChange(tab.id);
				}
				activeTab = tab.id;
			}}
		>
			{#if tab.faIcon}
				<i class="fa-solid fa-{tab.faIcon?.replace('fa-', '')} {tab.label ? 'mr-2' : ''}"></i>
			{/if}
			{#if tab.label}
				<span class="tab-label">{tab.label}</span>
			{/if}
		</button>
	{/each}
</div>
