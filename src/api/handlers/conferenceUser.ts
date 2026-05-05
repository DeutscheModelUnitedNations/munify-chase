import { abilityBuilder, enum_, schemaBuilder } from '$api/rumble';
import { eq } from 'drizzle-orm';
import { basics } from './basics';
import { db, schema } from '$api/db/db';
import { isGlobalAdmin } from '$api/services/isAdminEmail';
import { GraphQLError } from 'graphql';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';

const { arg, ref, pubsub, table } = basics('conferenceUser');

export { ref as ConferenceUserRef };

abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.conferenceUser.allow('read').when(({ mustBeLoggedIn }) => {
	// mustBeLoggedIn();
	return 'allow';
});

/**
 * Helper to check if the current user is an ADMIN for a specific conference
 * (either OIDC admin or conference ADMIN role)
 */
export async function assertConferenceAdmin(
	ctx: { hasRole: (role: string) => boolean; mustBeLoggedIn: () => { email?: string | null } },
	conferenceId: string
) {
	if (isGlobalAdmin(ctx)) {
		return;
	}

	const user = ctx.mustBeLoggedIn();
	if (!user.email) {
		throw new GraphQLError('User email is required');
	}

	const conferenceUser = await db.query.conferenceUser.findFirst({
		where: {
			conferenceId,
			userEmail: user.email,
			conferenceUserType: 'ADMIN'
		}
	});

	if (!conferenceUser) {
		throw new GraphQLError('You must be an ADMIN of this conference to perform this action');
	}
}

schemaBuilder.mutationFields((t) => ({
	createConferenceUser: t.drizzleField({
		type: ref,
		args: {
			conferenceId: t.arg({ type: 'ID', required: true }),
			userEmail: t.arg({ type: 'String', required: true }),
			conferenceUserType: t.arg({
				type: enum_({ tsName: 'conferenceUserType' }),
				required: true
			})
		},
		resolve: async (query, root, args, ctx, info) => {
			await assertConferenceAdmin(ctx, args.conferenceId);

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
					conferenceId: args.conferenceId,
					userEmail: args.userEmail,
					conferenceUserType: args.conferenceUserType
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.updated(result.id);

			return db.query.conferenceUser
				.findFirst(
					query(
						ctx.abilities.conferenceUser.filter('read', {
							inject: {
								where: { id: result.id }
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteConferenceUser: t.field({
		type: 'Boolean',
		args: {
			id: t.arg({ type: 'ID', required: true })
		},
		resolve: async (root, args, ctx, info) => {
			// First get the conference user to find the conferenceId
			const conferenceUser = await db.query.conferenceUser.findFirst({
				where: { id: args.id }
			});

			if (!conferenceUser) {
				throw new GraphQLError('Conference user not found');
			}

			await assertConferenceAdmin(ctx, conferenceUser.conferenceId);

			const currentUser = ctx.mustBeLoggedIn();

			// Prevent self-deletion
			if (conferenceUser.userEmail === currentUser.email) {
				throw new GraphQLError('You cannot delete yourself from the conference');
			}

			// Prevent deleting the last ADMIN
			if (conferenceUser.conferenceUserType === 'ADMIN') {
				const remainingAdmins = await db.query.conferenceUser.findMany({
					where: {
						conferenceId: conferenceUser.conferenceId,
						conferenceUserType: 'ADMIN',
						id: { ne: args.id }
					}
				});

				if (remainingAdmins.length === 0) {
					throw new GraphQLError(
						'Cannot delete the last ADMIN. Promote another user to ADMIN first.'
					);
				}
			}

			await db.delete(schema.conferenceUser).where(eq(schema.conferenceUser.id, args.id));

			pubsub.removed(args.id);

			return true;
		}
	}),

	updateConferenceUser: t.drizzleField({
		type: ref,
		args: {
			id: t.arg({ type: 'ID', required: true }),
			conferenceUserType: t.arg({
				type: enum_({ tsName: 'conferenceUserType' }),
				required: true
			}),
			committeeMemberId: t.arg({ type: 'ID' }),
			conferenceMemberId: t.arg({ type: 'ID' })
		},
		resolve: async (query, root, args, ctx, info) => {
			// First get the conference user to find the conferenceId
			const conferenceUser = await db.query.conferenceUser.findFirst({
				where: { id: args.id }
			});

			if (!conferenceUser) {
				throw new GraphQLError('Conference user not found');
			}

			await assertConferenceAdmin(ctx, conferenceUser.conferenceId);

			const currentUser = ctx.mustBeLoggedIn();

			// Prevent self-demotion from ADMIN
			if (
				conferenceUser.userEmail === currentUser.email &&
				conferenceUser.conferenceUserType === 'ADMIN' &&
				args.conferenceUserType !== 'ADMIN'
			) {
				throw new GraphQLError('You cannot demote yourself from ADMIN');
			}

			// Prevent orphaning the conference (removing the last ADMIN)
			if (conferenceUser.conferenceUserType === 'ADMIN' && args.conferenceUserType !== 'ADMIN') {
				const remainingAdmins = await db.query.conferenceUser.findMany({
					where: {
						conferenceId: conferenceUser.conferenceId,
						conferenceUserType: 'ADMIN',
						id: { ne: args.id }
					}
				});

				if (remainingAdmins.length === 0) {
					throw new GraphQLError(
						'Cannot demote the last ADMIN. Promote another user to ADMIN first.'
					);
				}
			}

			// Validate committeeMemberId belongs to a committee in the same conference
			if (args.committeeMemberId) {
				const committeeMember = await db.query.committeeMember.findFirst({
					where: { id: args.committeeMemberId },
					with: { committee: true }
				});
				if (
					!committeeMember ||
					committeeMember.committee.conferenceId !== conferenceUser.conferenceId
				) {
					throw new GraphQLError('Committee member does not belong to this conference');
				}
			}

			// Validate conferenceMemberId belongs to the same conference
			if (args.conferenceMemberId) {
				const conferenceMember = await db.query.conferenceMember.findFirst({
					where: { id: args.conferenceMemberId }
				});
				if (!conferenceMember || conferenceMember.conferenceId !== conferenceUser.conferenceId) {
					throw new GraphQLError('Conference member does not belong to this conference');
				}
			}

			// Build the update set
			const updateSet: Record<string, unknown> = {
				conferenceUserType: args.conferenceUserType
			};

			// Auto-clear: when role changes away from DELEGATE, clear committeeMemberId
			if (args.conferenceUserType !== 'DELEGATE') {
				updateSet.committeeMemberId = null;
			} else if (args.committeeMemberId !== undefined) {
				updateSet.committeeMemberId = args.committeeMemberId;
			}

			// Auto-clear: when role changes away from NON_STATE_ACTOR, clear conferenceMemberId
			if (args.conferenceUserType !== 'NON_STATE_ACTOR') {
				updateSet.conferenceMemberId = null;
			} else if (args.conferenceMemberId !== undefined) {
				updateSet.conferenceMemberId = args.conferenceMemberId;
			}

			await db
				.update(schema.conferenceUser)
				.set(updateSet)
				.where(eq(schema.conferenceUser.id, args.id));

			pubsub.updated(args.id);

			return db.query.conferenceUser
				.findFirst(
					query(
						ctx.abilities.conferenceUser.filter('read', {
							inject: {
								where: { id: args.id }
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
