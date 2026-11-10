import { abilityBuilder, object, query, schemaBuilder } from '#api/rumble';
import { linkConfig } from '#api/services/link/linkAuth';
import { isGlobalAdmin } from '#api/services/authHelper';
import {
	assertCanRequestLinkSync,
	assertCanRequestRemoteLinkSync,
	requestLinkSync,
	requestRemoteLinkSync
} from '#api/services/link/linkSync';

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

// "Sync now" (`linkSync.ts`). DELEGATOR offers the same `requestLinkSync`, which the second asks.
schemaBuilder.mutationField('requestLinkSync', (t) =>
	t.field({
		description:
			'Makes the link worker ask the linked DELEGATOR for everything again now, as on a reconnect (global admins and the linked DELEGATOR). False while no DELEGATOR is linked.',
		type: 'Boolean',
		resolve: (_root, _args, ctx) => {
			assertCanRequestLinkSync(ctx);
			return requestLinkSync();
		}
	})
);

schemaBuilder.mutationField('requestRemoteLinkSync', (t) =>
	t.field({
		description:
			"Asks the linked DELEGATOR to read everything of this instance again now, through DELEGATOR's own requestLinkSync (global admins). False while no DELEGATOR is linked; CONFLICT when DELEGATOR cannot be reached.",
		type: 'Boolean',
		resolve: (_root, _args, ctx) => {
			assertCanRequestRemoteLinkSync(ctx);
			return requestRemoteLinkSync();
		}
	})
);
