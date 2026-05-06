import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { eq } from 'drizzle-orm';
import { db, schema } from '$api/db/db';
import { isAdminInConference, isParticipantInConference } from '$api/services/authHelper';
import { GraphQLError } from 'graphql';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { emailValidation } from '$api/services/emailValidation';
import { attendanceCode as generateAttendanceCode } from '$lib/helpers/attendanceCode';

// Global admins bypass column restrictions entirely. Without this short-circuit,
// rumble's mergeFilters intersects the explicit-true sets across rules — the
// participant rule below hides userEmail/attendanceCode, and that decision wins
// over the admin rule because the admin rule has no `columns` key to contribute.
abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.conferenceUser.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx),
		columns: {
			id: true,
			conferenceId: true,
			userEmail: false,
			committeeMemberId: true,
			conferenceMemberId: true,
			conferenceUserType: true,
			attendanceCode: false,
			createdAt: true,
			updatedAt: true
		}
	};
});

abilityBuilder.conferenceUser.allow(['read', 'update', 'delete']).when((ctx) => {
	return {
		where: isAdminInConference(ctx),
		// Explicit all-columns include so the merge with the participant rule's
		// hide-list doesn't drop userEmail/attendanceCode for non-global admins.
		columns: {
			id: true,
			conferenceId: true,
			userEmail: true,
			committeeMemberId: true,
			conferenceMemberId: true,
			conferenceUserType: true,
			attendanceCode: true,
			createdAt: true,
			updatedAt: true
		}
	};
});

/**
 * Generate a fresh 6-char attendance code unique within the conference.
 * Retries on the rare unique collision; throws after 5 attempts.
 */
async function pickUniqueAttendanceCode(conferenceId: string) {
	for (let attempt = 0; attempt < 5; attempt++) {
		const code = generateAttendanceCode();
		const existing = await db.query.conferenceUser.findFirst({
			where: { conferenceId, attendanceCode: code }
		});
		if (!existing) return code;
	}
	throw new GraphQLError('Could not generate a unique attendance code, please retry');
}

export const ConferenceUserRef = object({
	table: 'conferenceUser',
	adjust: (t) => ({
		// Override the auto-generated `user` relation to be nullable: rumble
		// derives non-null from `userEmail.notNull`, but the User row is created
		// lazily on first OIDC login (services/OIDC.ts), so an imported but
		// not-yet-redeemed conferenceUser legitimately has no user.
		user: t.relation('user', { nullable: true }),
		// Live attendance state derived from the latest nsaPresenceEvent.
		// Per-row queries here can N+1 on large NSA dashboards; a bulk top-level
		// query in nsaPresenceEvent.ts is provided for live overview tabs.
		isCheckedIn: t.boolean({
			resolve: async (parent) => {
				const latest = await db.query.nsaPresenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.type === 'CHECK_IN';
			}
		}),
		currentCommitteeId: t.string({
			nullable: true,
			resolve: async (parent) => {
				const latest = await db.query.nsaPresenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.type === 'CHECK_IN' ? latest.committeeId : null;
			}
		}),
		currentCheckedInSince: t.field({
			type: 'DateTime',
			nullable: true,
			resolve: async (parent) => {
				const latest = await db.query.nsaPresenceEvent.findFirst({
					where: { conferenceUserId: parent.id },
					orderBy: { timestamp: 'desc' }
				});
				return latest?.type === 'CHECK_IN' ? latest.timestamp : null;
			}
		})
	})
});

const pubsub = rumblePubsub({ table: 'conferenceUser' });
query({ table: 'conferenceUser' });

schemaBuilder.mutationFields((t) => ({
	createConferenceUser: t.drizzleField({
		type: ConferenceUserRef,
		args: {
			conferenceId: t.arg.id({ required: true }),
			userEmail: t.arg.string({ required: true }).validate(emailValidation),
			conferenceUserType: t.arg({
				type: enum_({ tsName: 'conferenceUserType' }),
				required: true
			})
		},
		resolve: async (query, root, args, ctx) => {
			await db.query.conference
				.findFirst(
					ctx.abilities.conference.filter('update').merge({ where: { id: args.conferenceId } })
						.query.single
				)
				.then(assertFindFirstExists);

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

			// NSA users get an auto-generated 6-char fallback code printed on their badge.
			const initialAttendanceCode =
				args.conferenceUserType === 'NON_STATE_ACTOR'
					? await pickUniqueAttendanceCode(args.conferenceId)
					: null;

			const result = await db
				.insert(schema.conferenceUser)
				.values({
					conferenceId: args.conferenceId,
					userEmail: args.userEmail,
					conferenceUserType: args.conferenceUserType,
					attendanceCode: initialAttendanceCode
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.updated(result.id);

			return db.query.conferenceUser
				.findFirst(
					query(
						ctx.abilities.conferenceUser.filter('read').merge({
							where: { id: result.id }
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
		resolve: async (root, args, ctx) => {
			const conferenceUser = await db.query.conferenceUser
				.findFirst(
					ctx.abilities.conferenceUser.filter('delete').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

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
			conferenceMemberId: t.arg({ type: 'ID' })
		},
		resolve: async (query, root, args, ctx) => {
			const conferenceUser = await db.query.conferenceUser
				.findFirst(
					ctx.abilities.conferenceUser.filter('update').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

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
			// and the attendanceCode (no longer meaningful for non-NSAs).
			if (args.conferenceUserType !== 'NON_STATE_ACTOR') {
				updateSet.conferenceMemberId = null;
				if (conferenceUser.attendanceCode) {
					updateSet.attendanceCode = null;
				}
			} else {
				if (args.conferenceMemberId !== undefined) {
					updateSet.conferenceMemberId = args.conferenceMemberId;
				}
				// Promotion to NSA: ensure the user has an attendance code.
				if (!conferenceUser.attendanceCode) {
					updateSet.attendanceCode = await pickUniqueAttendanceCode(conferenceUser.conferenceId);
				}
			}

			await db
				.update(schema.conferenceUser)
				.set(updateSet)
				.where(eq(schema.conferenceUser.id, args.id));

			pubsub.updated(args.id);

			return db.query.conferenceUser
				.findFirst(
					query(
						ctx.abilities.conferenceUser.filter('read').merge({
							where: { id: args.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
