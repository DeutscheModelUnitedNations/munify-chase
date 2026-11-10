<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { DecisionKind } from './amendmentListState';

	interface Props {
		status: string;
		/** Shown on the beamer right now. */
		active: boolean;
		/** An action on this amendment is running. */
		busy: boolean;
		/** Stopping the presentation is running. */
		unpresenting: boolean;
		onpresent: () => void;
		onunpresent: () => void;
		onvote: () => void;
		ondecide: (kind: DecisionKind) => void;
	}

	let { status, active, busy, unpresenting, onpresent, onunpresent, onvote, ondecide }: Props =
		$props();

	const pending = $derived(status === 'PENDING');

	const decisions: { kind: DecisionKind; cls: string; icon: string; label: () => string }[] = [
		{ kind: 'consensus', cls: 'text-success', icon: 'handshake', label: m.adoptByConsensus },
		{ kind: 'accept', cls: 'text-success', icon: 'check', label: m.accept },
		{ kind: 'reject', cls: 'text-error', icon: 'x', label: m.reject }
	];
</script>

{#if active}
	<button class="btn btn-xs btn-primary" disabled={busy || unpresenting} onclick={onunpresent}
		>{m.stopPresenting()}</button
	>
{:else}
	<button class="btn btn-xs btn-ghost" disabled={busy || pending} onclick={onpresent}>
		<i aria-hidden="true" class="ph-fill ph-eye"></i>
		{m.present()}
	</button>
{/if}
<div class="join ml-auto" data-tour="chair-paper.decide">
	<button
		class="btn btn-xs btn-primary join-item"
		disabled={busy || unpresenting || pending}
		onclick={onvote}
	>
		<i aria-hidden="true" class="ph-fill ph-check-square-offset"></i>
		{m.startVote()}
	</button>
	<div class="dropdown dropdown-end join-item flex">
		<button
			tabindex="0"
			class="btn btn-xs btn-primary join-item px-1.5"
			aria-label={m.decideManually()}
			title={m.decideManually()}
		>
			<i aria-hidden="true" class="ph-fill ph-caret-down"></i>
		</button>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<ul
			tabindex="0"
			class="dropdown-content menu bg-base-100 border-base-300 rounded-box z-50 mt-1 w-48 border p-1 shadow-xl"
		>
			{#each decisions as decision (decision.kind)}
				<li>
					<button class={decision.cls} disabled={busy} onclick={() => ondecide(decision.kind)}>
						<i aria-hidden="true" class="ph-fill ph-{decision.icon}"></i>
						{decision.label()}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
