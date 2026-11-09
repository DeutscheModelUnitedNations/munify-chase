import { GraphQLError } from 'graphql';

/**
 * Rows a linked DELEGATOR owns are changed there (`docs/plans/delegator-link.md`). What CHASE owns
 * on the same row (a committee's session state, a conference's presentation settings) stays
 * editable, so a resolver passes only whether it touches DELEGATOR's fields.
 */
export function assertNotManagedByDelegator({
	managed,
	touchesDelegatorFields = true
}: {
	managed: boolean | null | undefined;
	touchesDelegatorFields?: boolean;
}) {
	if (managed && touchesDelegatorFields) {
		throw new GraphQLError('This comes from MUNify DELEGATOR. Change it there.');
	}
}

/** For an ability's `where`: only rows CHASE owns itself. */
export const NOT_MANAGED_BY_DELEGATOR = { managedByDelegator: false } as const;
