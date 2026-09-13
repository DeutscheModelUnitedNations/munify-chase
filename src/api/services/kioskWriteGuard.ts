import {
	GraphQLError,
	Kind,
	getOperationAST,
	type DocumentNode,
	type FragmentDefinitionNode,
	type SelectionSetNode
} from 'graphql';
import type { Plugin } from 'graphql-yoga';

/**
 * Structural read-only enforcement for display-kiosk (device-flow) sessions
 * — see the security note on kioskOIDCHandle and authHelper.ts's
 * isDisplayKiosk() for why this exists as its own transport-layer guard
 * rather than something threaded through per-table ability rules: a mutation
 * resolver that writes straight through `db`/`tx` without consulting the
 * shared ability-check helpers at all would stay exploitable from a stolen
 * kiosk session even after every helper was patched (this codebase has had
 * at least one such resolver — see the setVoteForMember fix). Blocking every
 * mutation field a device-flow session isn't explicitly allowed to call,
 * before any resolver or ability rule runs, doesn't depend on any of that
 * being right.
 *
 * Keep this allowlist tiny and each entry deliberately re-scoped for a
 * device-flow caller in its own resolver (never just "the normal ability
 * rule happens to also pass") — it's the one place a kiosk session is
 * allowed to write anything at all.
 */
const KIOSK_MUTATION_ALLOWLIST = new Set([
	// Idempotent self-registration by device id, gated to isDisplayKiosk(ctx)
	// in its own resolver (displayDevice.ts).
	'registerDisplayDevice'
]);

/**
 * Root-level mutation field names reachable from `selectionSet`, resolving
 * through inline fragments and named fragment spreads — a disallowed field
 * hidden behind `... on Mutation { ... }` or `...SomeFragment` is exactly as
 * live as one selected directly, so the allowlist has to see it too.
 * Fragment names are de-duped as they're visited to stay safe against a
 * fragment that (directly or transitively) spreads itself.
 */
function collectRootFieldNames(document: DocumentNode, selectionSet: SelectionSetNode): string[] {
	const names: string[] = [];
	const visitedFragments = new Set<string>();

	const visit = (set: SelectionSetNode) => {
		for (const selection of set.selections) {
			if (selection.kind === Kind.FIELD) {
				names.push(selection.name.value);
			} else if (selection.kind === Kind.INLINE_FRAGMENT) {
				visit(selection.selectionSet);
			} else if (selection.kind === Kind.FRAGMENT_SPREAD) {
				const fragmentName = selection.name.value;
				if (visitedFragments.has(fragmentName)) continue;
				visitedFragments.add(fragmentName);
				const fragment = document.definitions.find(
					(d): d is FragmentDefinitionNode =>
						d.kind === Kind.FRAGMENT_DEFINITION && d.name.value === fragmentName
				);
				if (fragment) visit(fragment.selectionSet);
			}
		}
	};

	visit(selectionSet);
	return names;
}

export const kioskWriteGuardPlugin: Plugin<{ isKioskSession?: boolean }> = {
	onExecute({ args, setResultAndStopExecution }) {
		if (!args.contextValue.isKioskSession) return;

		const operation = getOperationAST(args.document, args.operationName ?? undefined);
		if (!operation || operation.operation !== 'mutation') return;

		const disallowedFields = collectRootFieldNames(args.document, operation.selectionSet).filter(
			(name) => !KIOSK_MUTATION_ALLOWLIST.has(name)
		);

		if (disallowedFields.length > 0) {
			setResultAndStopExecution({
				data: null,
				errors: disallowedFields.map(
					(name) =>
						new GraphQLError(`Display kiosks are read-only: '${name}' is not permitted.`, {
							extensions: { code: 'FORBIDDEN' }
						})
				)
			});
		}
	}
};
