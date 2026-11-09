/**
 * The system roles the identity provider grants. `delegator` is the linked MUNify DELEGATOR's
 * (`#api/services/link/linkAuth`): only its link token grants it, never a person's session.
 */
const oidcRoles = ['admin', 'member', 'service_user', 'delegator'] as const;

export type OidcRole = (typeof oidcRoles)[number];

/** The role the linked DELEGATOR calls with. */
export const LINK_ROLE: OidcRole = 'delegator';

/** The role this instance asks for at the linked DELEGATOR: what DELEGATOR grants a CHASE. */
export const REMOTE_LINK_ROLE = 'chase';

/**
 * The known roles a role claim names, in either shape providers send: a list of names or of
 * `{ name }` objects (Logto), or an object keyed by role name (Zitadel).
 */
export function rolesOfClaim(rolesRaw: unknown): OidcRole[] {
	const collected: string[] = [];
	if (Array.isArray(rolesRaw)) {
		for (const role of rolesRaw) {
			const name = typeof role === 'string' ? role : (role as { name?: string })?.name;
			if (name) collected.push(name);
		}
	} else if (rolesRaw && typeof rolesRaw === 'object') {
		collected.push(...Object.keys(rolesRaw));
	}
	return knownRoles(collected);
}

export function knownRoles(names: readonly string[]): OidcRole[] {
	return oidcRoles.filter((role) => names.includes(role));
}
