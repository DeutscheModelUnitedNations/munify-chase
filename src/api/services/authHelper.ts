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
 * True for any request that authenticated through the Pi display kiosk's
 * device flow (see kioskOIDC.ts) — any staff member can sign a kiosk in with
 * their own credentials, there's no separate shared "display" account or
 * role to grant. What matters is *how* the request authenticated, not *who*
 * it is.
 *
 * This is used two ways, deliberately kept separate:
 *  - Here, in per-table `read` ability rules, to grant the same
 *    device-scoped read access a kiosk has always had (unchanged in shape —
 *    only the underlying signal moved from a shared account's role to the
 *    session type).
 *  - As the read-only enforcement boundary itself: `kioskWriteGuard.ts`
 *    rejects every GraphQL *mutation* for a device-flow session except a
 *    short explicit allowlist, at the transport layer, before any resolver
 *    or ability rule runs. That's deliberately a single, structural choke
 *    point rather than something threaded through every write-side ability
 *    helper (isGlobalAdmin, isTeamInConference, isAdminInConference, isAdmin,
 *    …) — a mutation resolver that writes straight through `db`/`tx` without
 *    consulting those helpers at all (this codebase has had at least one:
 *    see the setVoteForMember fix) would otherwise stay silently exploitable
 *    from a stolen kiosk's session even after every helper was patched.
 */
export function isDisplayKiosk(ctx: Context) {
	return ctx.isKioskSession === true;
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
