import { abilityBuilder, object, query } from '#api/rumble';
import { linkConfig } from '#api/services/link/linkAuth';
import { isGlobalAdmin } from '#api/services/authHelper';

/**
 * The state of the link to a MUNify DELEGATOR instance (`docs/plans/delegator-link.md`), read-only:
 * the link itself is configuration (`#api/services/link/linkAuth`). Everyone reads where it points
 * while it is configured, for the "managed by DELEGATOR" links back; there is nothing secret on
 * the row. The row of a link that ended stays for its keys (`linkState.ts`), and reads as none.
 */
abilityBuilder.instanceLink.allow('read').when((ctx) => {
	if (!linkConfig()) return undefined;
	// how the link fails (`lastError`) is for global admins, on the launcher's link card
	return isGlobalAdmin(ctx)
		? 'allow'
		: { columns: { id: true, remoteUrl: true, lastReconcileAt: true } };
});

object({ table: 'instanceLink' });

query({ table: 'instanceLink' });
