<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import type { absentDelegatesByCommittee } from './attendance';

	interface Props {
		groups: ReturnType<typeof absentDelegatesByCommittee>;
	}

	let { groups }: Props = $props();
</script>

<BasicCard title={m.absentDelegates()}>
	{#if groups.length === 0}
		<p class="text-base-content/60 py-4 text-center text-sm">{m.allDelegatesPresent()}</p>
	{:else}
		<div class="flex flex-col gap-4">
			{#each groups as group (group.committeeId)}
				<div>
					<div class="mb-2 flex items-baseline gap-2">
						<h3 class="font-semibold">{group.name}</h3>
						{#if group.abbreviation}
							<span class="text-base-content/60 text-sm">({group.abbreviation})</span>
						{/if}
						<span class="badge badge-sm badge-ghost ml-auto tabular-nums"
							>{group.absent.length}</span
						>
					</div>
					<ul class="flex flex-col gap-1">
						{#each group.absent as member (member.id)}
							<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
								{#if member.icon}
									<Flag size="xs" representation={{ type: 'NSA', icon: member.icon }} />
								{:else if member.alpha3Code}
									<Flag
										size="xs"
										representation={{ type: 'DELEGATION', alpha3Code: member.alpha3Code }}
									/>
								{:else}
									<i aria-hidden="true" class="ph-fill ph-user text-lg"></i>
								{/if}
								<span class="flex-1">{member.name}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	{/if}
</BasicCard>
