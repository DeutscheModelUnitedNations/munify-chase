import { db } from '#api/db/db';
import type { Context } from '#api/context';
import type { schemaBuilder } from '#api/rumble';
import { isTeamInConference } from '#api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';

export type ResolverContext = (typeof schemaBuilder)['$inferSchemaTypes']['Context'];

/** The paper as the caller's ability to `action` it reaches it; not found otherwise. */
export async function paperWithAbility({
	ctx,
	paperId,
	action
}: {
	ctx: ResolverContext;
	paperId: string;
	action: 'read' | 'update';
}) {
	return db.query.resolutionPaper
		.findFirst(
			(await ctx.abilities.resolutionPaper.filter(action)).merge({ where: { id: paperId } }).query
				.single
		)
		.then(assertFindFirstExists);
}

/** Whether the caller is on the team of the committee. */
export async function chairsCommittee({
	ctx,
	committeeId
}: {
	ctx: ResolverContext;
	committeeId: string;
}) {
	return !!(await db.query.committee.findFirst({
		where: { ...isTeamInConference(ctx), id: committeeId },
		columns: { id: true }
	}));
}

/** Whether the caller is on the team of the paper's committee. */
export async function chairsPaper({ ctx, paperId }: { ctx: ResolverContext; paperId: string }) {
	return !!(await chairedPaper({ ctx, paperId }));
}

/** Refuses (not found) unless the caller is on the team of the paper's committee. */
export async function assertChairsPaper({
	ctx,
	paperId
}: {
	ctx: ResolverContext;
	paperId: string;
}) {
	await chairedPaper({ ctx, paperId }).then(assertFindFirstExists);
}

function chairedPaper({ ctx, paperId }: { ctx: ResolverContext; paperId: string }) {
	return db.query.resolutionPaper.findFirst({
		where: { id: paperId, committee: isTeamInConference(ctx) },
		columns: { id: true }
	});
}

/**
 * The rule entries granting a paper's team and its creator, for the `OR` of a paper-scoped
 * table's ability.
 */
export function paperTeamOrCreator(ctx: Context) {
	const user = ctx.mustBeLoggedIn();
	return {
		user,
		rules: [
			{ paper: { committee: isTeamInConference(ctx) } },
			{ paper: { creatorCommitteeMember: { users: { user: { id: user.sub } } } } }
		]
	};
}
