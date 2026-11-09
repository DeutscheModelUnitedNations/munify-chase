import { abilityBuilder, object, query } from '#api/rumble';
import { linkConfig } from '#api/services/link/linkAuth';

/**
 * The state of the link to a MUNify DELEGATOR instance (`docs/plans/delegator-link.md`), read-only:
 * the link itself is configuration (`#api/services/link/linkAuth`). Everyone reads where it points
 * while it is configured, for the "managed by DELEGATOR" links back; there is nothing secret on
 * the row. The row of a link that ended stays for its keys (`linkState.ts`), and reads as none.
 */
abilityBuilder.instanceLink.allow('read').when(() => (linkConfig() ? 'allow' : undefined));

object({ table: 'instanceLink' });

query({ table: 'instanceLink' });
