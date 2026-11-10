<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import type { FlagRepresentation } from '#lib/components/flag';
	import Tabs from '#lib/components/Tabs.svelte';
	import { translateRegionalGroupEnum } from '#lib/utils/enumTranslationHelper';
	import type { RegionalgroupEnum } from '#lib/api/rumbleClient/client';
	import { delegationName, regionalGroupIcon } from './presence';

	interface Props {
		member: {
			present: boolean;
			representation: FlagRepresentation & {
				name?: string | null;
				alpha3Code?: string | null;
				regionalGroup?: RegionalgroupEnum | null;
			};
		};
		/** The first row carries the tour anchor */
		first?: boolean;
		onPresenceChange: (present: boolean) => void;
	}

	let { member, first = false, onPresenceChange }: Props = $props();

	const presenceTabs = [
		{
			id: false,
			name: m.absent(),
			icon: 'x'
		},
		{
			id: true,
			name: m.present(),
			icon: 'check'
		}
	];
</script>

<div
	class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
	data-tour={first ? 'presence.delegations' : undefined}
>
	<Flag representation={member.representation} size="sm" />
	<h3 class="flex-1 text-lg">
		{delegationName(member.representation)}
	</h3>
	{#if member.representation?.regionalGroup}
		{@const group = member.representation.regionalGroup}
		{@const icon = regionalGroupIcon(group)}
		<div class="tooltip tooltip-left text-xl" data-tip={translateRegionalGroupEnum(group)}>
			{#if icon}
				<i aria-hidden="true" class="ph-fill {icon}"></i>
			{/if}
		</div>
	{/if}
	<Tabs activeTab={member.present} tabs={presenceTabs} onTabChange={onPresenceChange} />
</div>
