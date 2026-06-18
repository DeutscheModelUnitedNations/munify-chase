import type { Context } from '$api/context';
import { configPrivate } from '$config/private';
import { GraphQLError } from 'graphql';

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

/**
 * Helper to check if the current user is a participant (any role) for a conference, or a global admin.
 *
 * @returns A filter object for the conference query. Injectable at conference level.
 */
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

/**
 * Where-filter fragment for the caller's `conferenceUser`, scoped to the
 * committee that owns the given paper. Pass additional committee predicates
 * (e.g. `{ amendmentSubmissionOpen: true }`) to gate on committee state in
 * the same query.
 *
 * Used with `db.query.conferenceUser.findFirst({ where: ..., with: { committeeMember: true } })
 * .then(assertFindFirstExists)` to fail closed when the user is not a member
 * or the committee state does not match.
 */
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

/**
 * Where-filter fragment for an `amendment` row whose proposer is the calling
 * user. Combine with other predicates via `OR` to authorize self-service
 * actions (e.g. proposer withdrawing their own amendment).
 */
export function isAmendmentProposer(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email required');
	return {
		proposer: {
			users: { userEmail: user.email }
		}
	} as const;
}

/**
 * Where-filter fragment for a `paperEditor` row whose `conferenceUser` belongs
 * to the calling user, scoped to the given paper. Used to authorize paper-
 * editor self-service actions (e.g. Y.js write access while the paper is
 * still in WORKING_PAPER / SUBMITTED status).
 */
export function isPaperEditor(ctx: Context, paperId: string) {
	const user = ctx.mustBeLoggedIn();
	return {
		paperId,
		conferenceUser: { user: { id: user.sub } }
	} as const;
}

/**
 * Where-filter fragment for a `resolutionPaper` row that the calling user
 * authors, i.e. is registered as a `paperEditor` for. Combine with other
 * predicates via `OR` to authorize author self-service actions (e.g. editing
 * the title while the paper is still a draft).
 */
export function isPaperAuthor(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	return {
		editors: {
			conferenceUser: { user: { id: user.sub } }
		}
	} as const;
}
