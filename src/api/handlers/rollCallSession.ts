import { db, schema } from '#api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '#api/rumble';
import { isTeamInConference, isParticipantInConference } from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { findUpdatableCommittee, type HandlerContext } from './helpers/scopedLookups';
import { sessionStartColumns, setActiveSession } from './helpers/committeeSessions';

abilityBuilder.rollCallSession.allow('read').when((ctx) => ({
	where: { committee: isParticipantInConference(ctx) }
}));

abilityBuilder.rollCallSession.allow('update').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

const ref = object({ table: 'rollCallSession' });
const pubsub = rumblePubsub({ table: 'rollCallSession' });
// committee.activeRollCallSessionId is now the source of truth for "is a roll call
// happening?", so every start/complete must republish the committee record too.
const committeePubsub = rumblePubsub({ table: 'committee' });
query({ table: 'rollCallSession' });

async function readableSession(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.rollCallSession.filter('read')).merge({ where: { id } }).query.single;
}

schemaBuilder.mutationFields((t) => {
	return {
		startRollCallSession: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id().validate(nanoidValidation),
				committeeId: t.arg.id({ required: true })
			},
			resolve: async (q, _root, args, ctx) => {
				const committee = await findUpdatableCommittee(ctx, args.committeeId);

				// Resume an already-active session if one is referenced: the committee's reference is
				// the single source of truth, no need to scan for sessions without completedAt.
				if (committee.activeRollCallSessionId) {
					return db.query.rollCallSession
						.findFirst(q(await readableSession(ctx, committee.activeRollCallSessionId)))
						.then(assertFindFirstExists);
				}

				const values = {
					...(await sessionStartColumns({ ctx, id: args.id, committee })),
					currentMemberIndex: 0
				};

				const result = await db.transaction(async (tx) => {
					const inserted = await tx
						.insert(schema.rollCallSession)
						.values(values)
						.returning()
						.then(assertFirstEntryExists);
					await setActiveSession({
						tx,
						committeeId: args.committeeId,
						active: { activeRollCallSessionId: inserted.id }
					});
					return inserted;
				});

				pubsub.created();
				pubsub.updated(result.id);
				committeePubsub.updated(args.committeeId);

				return db.query.rollCallSession
					.findFirst(q(await readableSession(ctx, result.id)))
					.then(assertFindFirstExists);
			}
		}),

		setRollCallSessionIndex: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				currentMemberIndex: t.arg.int({ required: true })
			},
			resolve: async (q, _root, args, ctx) => {
				await db
					.update(schema.rollCallSession)
					.set({ currentMemberIndex: args.currentMemberIndex })
					.where(
						(await ctx.abilities.rollCallSession.filter('update')).merge({ where: { id: args.id } })
							.sql.where
					);

				pubsub.updated(args.id);

				return db.query.rollCallSession
					.findFirst(q(await readableSession(ctx, args.id)))
					.then(assertFindFirstExists);
			}
		}),

		completeRollCallSession: t.field({
			type: 'Boolean',
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (_root, args, ctx) => {
				// Look up the committee whose `activeRollCallSessionId` points at us so
				// we can clear it in the same transaction. Reading via the session row
				// keeps the ability scope check intact.
				const sessionFilter = (await ctx.abilities.rollCallSession.filter('update')).merge({
					where: { id: args.id }
				});
				const session = await db.query.rollCallSession
					.findFirst(sessionFilter.query.single)
					.then(assertFindFirstExists);

				await db.transaction(async (tx) => {
					await tx
						.update(schema.rollCallSession)
						.set({ completedAt: new Date() })
						.where(sessionFilter.sql.where);
					await setActiveSession({
						tx,
						committeeId: session.committeeId,
						active: { activeRollCallSessionId: null }
					});
				});

				pubsub.updated(args.id);
				pubsub.removed();
				committeePubsub.updated(session.committeeId);

				return true;
			}
		})
	};
});
