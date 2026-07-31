import type { Context } from '$api/context';
import { configPrivate } from '$config/private';
import { GraphQLError } from 'graphql';

export function isAdminEmail(email: string) {
	const whitelistEmails = configPrivate.ADMIN_EMAIL_WHITELIST.split(',').filter(Boolean);
	const whitelistDomains = configPrivate.ADMIN_DOMAIN_WHITELIST.split(',').filter(Boolean);
	const domain = email.split('@')[1];

	return whitelistEmails.includes(email) || whitelistDomains.includes(domain);
}

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
 * Shared display-kiosk account (OIDC `service_user` role). All Pi displays
 * authenticate as this one account; per-device scoping is enforced by the
 * deviceId the kiosk queries against a non-revoked `displayDevice` row, not
 * by this shared identity. So read access only checks the role here.
 */
export function isDisplayKiosk(ctx: Context) {
	return ctx.hasRole('service_user');
}

export function isTeamInConference(ctx: Context) {
	if (isGlobalAdmin(ctx)) {
		return {};
	}

	const userId = ctx.mustBeLoggedIn().sub;

	return {
		conference: {
			OR: [
				{
					users: {
						user: {
							id: userId
						},
						conferenceUserType: 'ADMIN' as const
					}
				},
				{
					users: {
						user: {
							id: userId
						},
						conferenceUserType: 'TEAM' as const
					}
				}
			]
		}
	};
}

export function isParticipantInConference(ctx: Context) {
	return {
		conference: isParticipant(ctx)
	};
}

export function isAdminInConference(ctx: Context) {
	return {
		conference: isAdmin(ctx)
	};
}

export function isAdmin(ctx: Context) {
	if (isGlobalAdmin(ctx)) {
		return {};
	}

	const userId = ctx.mustBeLoggedIn().sub;

	return {
		users: {
			user: {
				id: userId
			},
			conferenceUserType: 'ADMIN' as const
		}
	};
}

export function isParticipant(ctx: Context) {
	if (isGlobalAdmin(ctx)) {
		return {};
	}

	const userId = ctx.mustBeLoggedIn().sub;

	return {
		users: {
			user: {
				id: userId
			}
		}
	};
}

export function committeeMemberForPaper(
	ctx: Context,
	paperId: string,
	committeePredicates: Record<string, unknown> = {}
) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email required');
	return {
		userEmail: user.email,
		committeeMember: {
			committee: {
				resolutionPapers: { id: paperId },
				...committeePredicates
			}
		}
	} as const;
}

export function isAmendmentProposer(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email required');
	return {
		proposer: {
			users: { userEmail: user.email }
		}
	} as const;
}

export function isPaperEditor(ctx: Context, paperId: string) {
	const user = ctx.mustBeLoggedIn();
	return {
		paperId,
		conferenceUser: { user: { id: user.sub } }
	} as const;
}

export function isPaperAuthor(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	return {
		editors: {
			conferenceUser: { user: { id: user.sub } }
		}
	} as const;
}
