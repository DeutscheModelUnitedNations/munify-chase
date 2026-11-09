<script lang="ts" generics="T">
	type Tab = {
		id: T;
		icon?: string;
		label?: string;
		tooltip?: string;
	};

	interface Props {
		tabs: Tab[];
		activeTab: T;
		onTabChange?: (tab: T) => void;
	}

	let { tabs, activeTab = $bindable(), onTabChange }: Props = $props();
</script>

<div class="tabs tabs-box h-auto" role="tablist">
	{#each tabs as tab (tab.id)}
		<button
			role="tab"
			class="tab flex-1 {activeTab === tab.id
				? 'tab-active'
				: ''} h-auto items-center py-3 tooltip tooltip-bottom"
			data-tip={tab.tooltip}
			aria-selected={activeTab === tab.id}
			aria-label={tab.label ?? tab.icon}
			tabindex={activeTab === tab.id ? 0 : -1}
			onclick={() => {
				if (activeTab === tab.id) return;
				if (onTabChange) {
					onTabChange(tab.id);
				}
				activeTab = tab.id;
			}}
		>
			{#if tab.icon}
				<i aria-hidden="true" class="ph-fill ph-{tab.icon} {tab.label ? 'sm:mr-2' : ''} text-lg"
				></i>
			{/if}
			{#if tab.label}
				<span class="tab-label hidden sm:inline">{tab.label}</span>
			{/if}
		</button>
	{/each}
</div>
