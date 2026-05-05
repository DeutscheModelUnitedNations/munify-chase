import { configPrivate } from '$config/private';

export function isAdminEmail(email: string) {
	const whitelistEmails = configPrivate.ADMIN_EMAIL_WHITELIST.split(',').filter(Boolean);
	const whitelistDomains = configPrivate.ADMIN_DOMAIN_WHITELIST.split(',').filter(Boolean);
	const domain = email.split('@')[1];

	return whitelistEmails.includes(email) || whitelistDomains.includes(domain);
}

/**
 * Check if the current user is a global admin (OIDC admin role OR whitelisted email).
 * Global admins have full access to everything.
 */
export function isGlobalAdmin(ctx: {
	hasRole: (role: string) => boolean;
	mustBeLoggedIn: () => { email?: string | null };
}): boolean {
	if (ctx.hasRole('admin')) return true;
	try {
		const user = ctx.mustBeLoggedIn();
		return !!(user.email && isAdminEmail(user.email));
	} catch {
		return false;
	}
}
