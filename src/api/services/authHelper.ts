import type { Context } from '$api/context';
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
export function isGlobalAdmin(ctx: Context) {
	if (ctx.hasRole('admin')) return true;
	try {
		const user = ctx.mustBeLoggedIn();
		return !!(user.email && isAdminEmail(user.email));
	} catch {
		return false;
	}
}

/**
 * Helper to check if the current user is a chair (ADMIN/TEAM) for a conference, or a global admin.
 *
 * @returns A filter object for the conference query. Injectable at e.g. committee level.
 */
export function isChairInConference(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	if (isGlobalAdmin(ctx)) {
		return {};
	}

	const userEmail = user.email;
	if (!userEmail) {
		throw new Error('User email is required to check committee chair or admin status');
	}

	return {
		conference: {
			OR: [
				{
					users: {
						user: {
							email: userEmail
						},
						conferenceUserType: 'ADMIN' as const
					}
				},
				{
					users: {
						user: {
							email: userEmail
						},
						conferenceUserType: 'TEAM' as const
					}
				}
			]
		}
	};
}

/**
 * Helper to check if the current user is a participant (any role) for a conference, or a global admin.
 *
 * @returns A filter object for the conference query. Injectable at e.g. committee level.
 */
export function isParticipantInConference(ctx: Context) {
	return {
		conference: isParticipant(ctx)
	};
}

/**
 * Helper to check if the current user is an ADMIN for a specific conference
 * (either OIDC admin or conference ADMIN role)
 *
 * @returns A filter object for the conference query. Injectable at conference level.
 */
export function isAdminInConference(ctx: Context) {
	return {
		conference: isAdmin(ctx)
	};
}

/**
 * Helper to check if the current user is an ADMIN
 * (either OIDC admin or conference ADMIN role)
 *
 * @returns A filter object for the conference query. Injectable at conference level.
 */
export function isAdmin(ctx: Context) {
	if (isGlobalAdmin(ctx)) {
		return {};
	}

	const user = ctx.mustBeLoggedIn();
	const userEmail = user.email;
	if (!userEmail) {
		throw new Error('User email is required to check committee chair or admin status');
	}

	return {
		users: {
			user: {
				email: userEmail
			},
			conferenceUserType: 'ADMIN' as const
		}
	};
}

/**
 * Helper to check if the current user is a participant (any role) for a conference, or a global admin.
 *
 * @returns A filter object for the conference query. Injectable at conference level.
 */
export function isParticipant(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	const userEmail = user.email;
	if (!userEmail) {
		throw new Error('User email is required to check participant status');
	}

	return {
		users: {
			user: {
				email: userEmail
			}
		}
	};
}
