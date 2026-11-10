<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { decisionMessage, type DecisionKind } from './amendmentListState';

	interface Props {
		kind: DecisionKind;
		onconfirm: () => void;
		onclose: () => void;
	}

	let { kind, onconfirm, onclose }: Props = $props();
</script>

<!-- Chair decisions alter the document immediately, so they are confirmed first -->
<div class="modal modal-open">
	<div class="modal-box">
		<h3 class="text-lg font-bold">{m.confirm()}</h3>
		<p class="py-3">{decisionMessage(kind)}</p>
		<div class="modal-action">
			<button class="btn btn-ghost" onclick={onclose}>{m.cancel()}</button>
			<button class="btn {kind === 'reject' ? 'btn-error' : 'btn-success'}" onclick={onconfirm}
				>{m.confirm()}</button
			>
		</div>
	</div>
	<button class="modal-backdrop" aria-label={m.cancel()} onclick={onclose}></button>
</div>
