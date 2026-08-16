import { GraphQLError, Kind, getOperationAST, type FieldNode } from 'graphql';
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

export const kioskWriteGuardPlugin: Plugin<{ isKioskSession?: boolean }> = {
	onExecute({ args, setResultAndStopExecution }) {
		if (!args.contextValue.isKioskSession) return;

		const operation = getOperationAST(args.document, args.operationName ?? undefined);
		if (!operation || operation.operation !== 'mutation') return;

		const disallowedFields = operation.selectionSet.selections
			.filter((s): s is FieldNode => s.kind === Kind.FIELD)
			.map((f) => f.name.value)
			.filter((name) => !KIOSK_MUTATION_ALLOWLIST.has(name));

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
