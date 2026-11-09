import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '#api/rumble';
import { eq } from 'drizzle-orm';
import { db, schema } from '#api/db/db';
import {
	isAdminInConference,
	isParticipantInConference,
	isTeamInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { GraphQLError } from 'graphql';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { emailValidation } from '#api/services/emailValidation';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { NOT_MANAGED_BY_DELEGATOR } from '#api/services/link/managedRows';
import {
	findUpdatableConference,
	type HandlerContext,
	type Transaction
} from './helpers/scopedLookups';
import { assertNotDemotingSelf, conferenceUserUpdate } from './helpers/conferenceUserRules';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.conferenceUser.allow('read').when(
	linkedDelegator({
		where: { conference: SYNCED_CONFERENCE },
		columns: {
			id: true,
			conferenceId: true,
			conferenceUserType: true,
			userEmail: true,
			committeeMemberId: true,
			conferenceMemberId: true
		}
	})
);

abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx),
		columns: {
			id: true,
			conferenceId: true,
			userEmail: false,
			name: false,
			committeeMemberId: true,
			conferenceMemberId: true,
			conferenceUserType: true,
			createdAt: true,
			updatedAt: true
		}
	};
});

// Team read — exposes name/email so team members can see who wrote comments, and what the NSA
// scanner identifies a nametag or card by.
abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	return {
		where: isTeamInConference(ctx),
		columns: {
			id: true,
			conferenceId: true,
			userEmail: true,
			name: true,
			committeeMemberId: true,
			conferenceMemberId: true,
			conferenceUserType: true,
			cardNumber: true,
			createdAt: true,
			updatedAt: true
		}
	};
});

// Self read
abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	const sub = ctx.oidc?.user.sub;
	if (sub) {
		return {
			where: {
				user: {
					id: sub
				}
			},
			columns: {
				id: true,
				conferenceId: true,
				userEmail: true,
				name: true,
				committeeMemberId: true,
				conferenceMemberId: true,
				conferenceUserType: true,
				createdAt: true,
				updatedAt: true
			}
		};
	}
});

abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	return {
		where: isAdminInConference(ctx),
		// Explicit all-columns include so the merge with the participant rule's
		// hide-list doesn't drop userEmail for non-global admins.
		columns: {
			id: true,
			conferenceId: true,
			userEmail: true,
			name: true,
			committeeMemberId: true,
			conferenceMemberId: true,
			conferenceUserType: true,
			managedByDelegator: true,
			cardNumber: true,
			createdAt: true,
			updatedAt: true
		}
	};
});

// a person synced from a linked DELEGATOR is changed there
abilityBuilder.conferenceUser.allow(['update', 'delete']).when((ctx) => ({
	where: { ...isAdminInConference(ctx), ...NOT_MANAGED_BY_DELEGATOR }
}));

const ConferenceUserRef = object({
	table: 'conferenceUser',
	adjust: (t) => ({
		// Override the auto-generated `user` relation to be nullable: rumble
		// derives non-null from `userEmail.notNull`, but the User row is created
		// lazily on first OIDC login (services/OIDC.ts), so an imported but
		// not-yet-redeemed conferenceUser legitimately has no user.
		user: t.relation('user', { nullable: true }),
		// Live attendance state derived from the latest presenceEvent.
		// Per-row queries here can N+1 on large dashboards; a bulk top-level
		// query in presenceEvent.ts is provided for live overview tabs.
		isCheckedIn: t.boolean({
			resolve: async (parent) => {
				const latest = await db.query.presenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.present ?? false;
			}
		}),
		currentCommitteeId: t.string({
			nullable: true,
			resolve: async (parent) => {
				const latest = await db.query.presenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.present ? latest.committeeId : null;
			}
		}),
		currentCheckedInSince: t.field({
			type: 'DateTime',
			nullable: true,
			resolve: async (parent) => {
				const latest = await db.query.presenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.present ? latest.timestamp : null;
			}
		})
	})
});

const pubsub = rumblePubsub({ table: 'conferenceUser' });
query({ table: 'conferenceUser' });

async function readableConferenceUser(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.conferenceUser.filter('read')).merge({ where: { id } }).query.single;
}

/**
 * A conference keeps at least one admin. Checked inside the transaction of the change, so two
 * concurrent changes cannot both pass the count.
 */
async function assertOtherAdminRemains({
	tx,
	conferenceUser,
	message
}: {
	tx: Transaction;
	conferenceUser: { id: string; conferenceId: string };
	message: string;
}) {
	const otherAdmin = await tx.query.conferenceUser.findFirst({
		where: {
			conferenceId: conferenceUser.conferenceId,
			conferenceUserType: 'ADMIN',
			id: { ne: conferenceUser.id }
		}
	});
	if (!otherAdmin) throw new GraphQLError(message);
}

/** The seats a conference user is given must be of their own conference. */
async function assertSeatsInConference({
	conferenceId,
	committeeMemberId,
	conferenceMemberId
}: {
	conferenceId: string;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
}) {
	const committeeMember = committeeMemberId
		? await db.query.committeeMember.findFirst({
				where: { id: committeeMemberId },
				with: { committee: true }
			})
		: undefined;
	if (committeeMemberId && committeeMember?.committee.conferenceId !== conferenceId) {
		throw new GraphQLError('Committee member does not belong to this conference');
	}

	const conferenceMember = conferenceMemberId
		? await db.query.conferenceMember.findFirst({ where: { id: conferenceMemberId } })
		: undefined;
	if (conferenceMemberId && conferenceMember?.conferenceId !== conferenceId) {
		throw new GraphQLError('Conference member does not belong to this conference');
	}
}

schemaBuilder.mutationFields((t) => ({
	createConferenceUser: t.drizzleField({
		type: ConferenceUserRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			conferenceId: t.arg.id({ required: true }),
			userEmail: t.arg.string({ required: true }).validate(emailValidation),
			name: t.arg.string(),
			conferenceUserType: t.arg({
				type: enum_({ tsName: 'conferenceUserType' }),
				required: true
			})
		},
		resolve: async (query, _root, args, ctx) => {
			await findUpdatableConference(ctx, args.conferenceId);

			// Check if user already exists in this conference
			const existing = await db.query.conferenceUser.findFirst({
				where: {
					conferenceId: args.conferenceId,
					userEmail: args.userEmail
				}
			});

			if (existing) {
				throw new GraphQLError(`User already exists in this conference: ${args.userEmail}`);
			}

			const result = await db
				.insert(schema.conferenceUser)
				.values({
					id: args.id,
					conferenceId: args.conferenceId,
					userEmail: args.userEmail,
					name: args.name?.trim() || null,
					conferenceUserType: args.conferenceUserType
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.updated(result.id);

			return db.query.conferenceUser
				.findFirst(query(await readableConferenceUser(ctx, result.id)))
				.then(assertFindFirstExists);
		}
	}),

	deleteConferenceUser: t.field({
		type: 'Boolean',
		args: {
			id: t.arg({ type: 'ID', required: true })
		},
		resolve: async (_root, args, ctx) => {
			const conferenceUser = await db.query.conferenceUser
				.findFirst(
					(await ctx.abilities.conferenceUser.filter('delete')).merge({ where: { id: args.id } })
						.query.single
				)
				.then(assertFindFirstExists);

			const currentUser = ctx.mustBeLoggedIn();

			// Prevent self-deletion
			if (conferenceUser.userEmail === currentUser.email) {
				throw new GraphQLError('You cannot delete yourself from the conference');
			}

			await db.transaction(async (tx) => {
				if (conferenceUser.conferenceUserType === 'ADMIN') {
					await assertOtherAdminRemains({
						tx,
						conferenceUser,
						message: 'Cannot delete the last ADMIN. Promote another user to ADMIN first.'
					});
				}
				await tx.delete(schema.conferenceUser).where(eq(schema.conferenceUser.id, args.id));
			});

			pubsub.removed();

			return true;
		}
	}),

	updateConferenceUser: t.drizzleField({
		type: ConferenceUserRef,
		args: {
			id: t.arg({ type: 'ID', required: true }),
			conferenceUserType: t.arg({
				type: enum_({ tsName: 'conferenceUserType' }),
				required: true
			}),
			committeeMemberId: t.arg({ type: 'ID' }),
			conferenceMemberId: t.arg({ type: 'ID' }),
			name: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			const conferenceUser = await db.query.conferenceUser
				.findFirst(
					(await ctx.abilities.conferenceUser.filter('update')).merge({ where: { id: args.id } })
						.query.single
				)
				.then(assertFindFirstExists);

			assertNotDemotingSelf({
				conferenceUser,
				callerEmail: ctx.mustBeLoggedIn().email,
				newType: args.conferenceUserType
			});
			await assertSeatsInConference({ conferenceId: conferenceUser.conferenceId, ...args });

			const demotesAdmin =
				conferenceUser.conferenceUserType === 'ADMIN' && args.conferenceUserType !== 'ADMIN';
			await db.transaction(async (tx) => {
				if (demotesAdmin) {
					await assertOtherAdminRemains({
						tx,
						conferenceUser,
						message: 'Cannot demote the last ADMIN. Promote another user to ADMIN first.'
					});
				}
				await tx
					.update(schema.conferenceUser)
					.set(conferenceUserUpdate(args))
					.where(eq(schema.conferenceUser.id, args.id));
			});

			pubsub.updated(args.id);

			return db.query.conferenceUser
				.findFirst(query(await readableConferenceUser(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	})
}));
