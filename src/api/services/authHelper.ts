import type { Context } from '#api/context';
import { ADMIN_DOMAIN_WHITELIST, ADMIN_EMAIL_WHITELIST } from '$app/env/private';
import { GraphQLError } from 'graphql';
import { sql } from 'drizzle-orm';

export function isAdminEmail(email: string) {
	const whitelistEmails = ADMIN_EMAIL_WHITELIST.split(',').filter(Boolean);
	const whitelistDomains = ADMIN_DOMAIN_WHITELIST.split(',').filter(Boolean);
	const domain = email.split('@')[1];

	return whitelistEmails.includes(email) || whitelistDomains.includes(domain);
}

/** A filter no row matches, for a rule that grants nothing. */
const NO_ROWS = { RAW: sql`false` };

/**
 * A filter every row matches, for a global admin. Not `{}`: inside an `OR` (the paper's update
 * rule) an empty filter is dropped rather than counted as true, which left global admins matching
 * nothing.
 */
const ANY_ROW = { RAW: sql`true` };

/**
 * The signed-in person's user id. The linked DELEGATOR calls without a session, so a rule that
 * needs one grants it nothing (`undefined`) rather than failing the whole query, which would also
 * fail the link's own rules; anybody else without a session gets "Must be logged in" as before.
 */
export function sessionUserId(ctx: Context) {
	const user = ctx.oidc?.user;
	if (user) return user.sub;
	if (ctx.linkRequest) return undefined;
	return ctx.mustBeLoggedIn().sub;
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

export function isTeamInConference(ctx: Context) {
	if (isGlobalAdmin(ctx)) {
		return ANY_ROW;
	}

	const userId = sessionUserId(ctx);
	if (!userId) return NO_ROWS;

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
		return ANY_ROW;
	}

	const userId = sessionUserId(ctx);
	if (!userId) return NO_ROWS;

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
		return ANY_ROW;
	}

	const userId = sessionUserId(ctx);
	if (!userId) return NO_ROWS;

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
	const userId = sessionUserId(ctx);
	if (!userId) return NO_ROWS;
	return {
		editors: {
			conferenceUser: { user: { id: userId } }
		}
	} as const;
}

/** The linked MUNify DELEGATOR calling with its token, once the link is approved. */
async function isLinkedDelegator(ctx: Context) {
	return (await ctx.linkCaller())?.status === 'ACTIVE';
}

/** Conferences that came from the linked DELEGATOR: the only ones it reads back. */
export const SYNCED_CONFERENCE = { managedByDelegator: true } as const;

/**
 * For `.when(linkedDelegator(...))`: what the linked DELEGATOR reads back
 * (`docs/plans/delegator-link.md`), only of synced conferences and only these columns. Grants
 * nothing to anybody else.
 */
export function linkedDelegator<R>(grant: R) {
	return async (ctx: Context) => ((await isLinkedDelegator(ctx)) ? grant : undefined);
}
