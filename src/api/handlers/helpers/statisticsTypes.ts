import { db } from '#api/db/db';
import { schemaBuilder } from '#api/rumble';
import type { CommitteeActivity } from './statisticsMath';
import type { ResolverContext } from './paperAccess';

/**
 * The committee activity type the statistics and mission control both answer, each under its own
 * name and with its own type of `committeeId`.
 */
export function committeeActivityType({ name, idAs }: { name: string; idAs: 'ID' | 'String' }) {
	const ref = schemaBuilder.objectRef<CommitteeActivity>(name);
	schemaBuilder.objectType(ref, {
		fields: (t) => ({
			committeeId: idAs === 'ID' ? t.exposeID('committeeId') : t.exposeString('committeeId'),
			committeeName: t.exposeString('committeeName'),
			committeeAbbreviation: t.exposeString('committeeAbbreviation'),
			totalSpeakingSeconds: t.exposeInt('totalSpeakingSeconds'),
			speechCount: t.exposeInt('speechCount'),
			voteCount: t.exposeInt('voteCount')
		})
	});
	return ref;
}

/** The conference, when the signed-in caller may read it. */
async function readableConference({
	ctx,
	conferenceId
}: {
	ctx: ResolverContext;
	conferenceId: string;
}) {
	ctx.mustBeLoggedIn();
	return db.query.conference.findFirst(
		(await ctx.abilities.conference.filter('read')).merge({ where: { id: conferenceId } }).query
			.single
	);
}

/** A resolver for a conference's figures, answering null unless the caller may read it. */
export function forReadableConference<T>(figuresOf: (conferenceId: string) => Promise<T>) {
	return async (_root: unknown, args: { conferenceId: string }, ctx: ResolverContext) =>
		(await readableConference({ ctx, conferenceId: args.conferenceId }))
			? figuresOf(args.conferenceId)
			: null;
}
