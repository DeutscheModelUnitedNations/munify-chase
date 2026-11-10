import { type Exchange, type Operation, makeOperation } from '@urql/core';
import { filter, map, pipe } from 'wonka';

/** A mutation another tab ran, replayed here by the cross-tab sync */
function isRemoteMutation(op: Operation) {
	const meta = (op.context as { crossTabSync?: { remote?: boolean } }).crossTabSync;
	return op.kind === 'mutation' && !!meta?.remote;
}

/**
 * Keeps mutations replayed from another tab optimistic-only here, so this tab never sends
 * them itself, and swallows their teardowns.
 */
export const keepSyntheticOptimisticExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		const syntheticKeys = new Set<number>();
		return pipe(
			ops$,
			filter((op) => !(op.kind === 'teardown' && syntheticKeys.delete(op.key))),
			map((op) => {
				if (!isRemoteMutation(op)) return op;
				syntheticKeys.add(op.key);
				if (op.context.optimistic) return op;
				return makeOperation(op.kind, op, { ...op.context, optimistic: true });
			}),
			forward
		);
	};
