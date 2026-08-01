import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	schemaBuilder,
	pubsub as rumblePubsub
} from '$api/rumble';
import {
	isAdminInConference,
	isDisplayKiosk,
	isGlobalAdmin,
	isTeamInConference
} from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

const displayDeviceLocaleEnum = enum_({
	tsName: 'displayDeviceLocale'
});

abilityBuilder.displayDevice.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) {
		return { where: {} };
	}
	// The shared kiosk account may read any device row, including revoked
	// ones — per-device scoping comes from the deviceId the kiosk queries,
	// not the identity. Excluding revoked rows here used to seem like the
	// obvious extra lockout, but it actively breaks revocation: a revoked
	// device's own live query on itself is how /kiosk notices `revoked` and
	// shows the "you've been revoked" screen. Once that row disappeared from
	// its own read filter, the by-id query started throwing (findFirst
	// required, nothing matched), which surfaced through the live
	// subscription as a dropped connection — an "offline" banner instead of
	// the revoked message, on the one row a revoked kiosk most needs to see.
	if (isDisplayKiosk(ctx)) {
		return { where: {} };
	}
	// Conference admins and team members see devices assigned to one of
	// their conferences only. Unassigned devices are explicitly excluded
	// via `conferenceId: { isNotNull: true }` rather than relying on the
	// relational filter alone to fail closed on a null FK — claiming a
	// freshly-paired Pi is a global-admin action, and a not-yet-claimed
	// device must never be shown to (or claimable by) a conference
	// organizer who happens to be admin/team somewhere else.
	return { where: { conferenceId: { isNotNull: true }, ...isTeamInConference(ctx) } };
});

abilityBuilder.displayDevice.allow('update').when((ctx) => {
	if (isGlobalAdmin(ctx)) {
		return { where: {} };
	}
	// See note on `read` above — conference admins/team members can only
	// mutate devices already assigned to one of their conferences, not
	// unassigned ones. Same predicate as `read` so nobody can ever see an
	// entry they aren't also allowed to edit.
	return { where: { conferenceId: { isNotNull: true }, ...isTeamInConference(ctx) } };
});

abilityBuilder.displayDevice.allow('delete').when((ctx) => {
	// Deletion is a stronger, irreversible action than editing settings, so
	// — unlike read/update — team members don't get it, only admins. Baking
	// `revoked: true` into the ability itself (rather than only checking it
	// in the resolver) means an attempt to delete a still-active device is
	// rejected at the same layer as every other permission check, for
	// anyone, including global admins.
	if (isGlobalAdmin(ctx)) {
		return { where: { revoked: true } };
	}
	return {
		where: { revoked: true, conferenceId: { isNotNull: true }, ...isAdminInConference(ctx) }
	};
});

export const DisplayDeviceRef = object({
	table: 'displayDevice'
});

const pubsub = rumblePubsub({ table: 'displayDevice' });
query({
	table: 'displayDevice'
});

schemaBuilder.mutationFields((t) => ({
	/**
	 * Called by a Pi on first contact. Idempotent upsert by the Pi-generated
	 * id. Only the shared display account (service_user role) may register.
	 * Creates the row unassigned; it stays inert (kiosk shows a pairing QR)
	 * until an organizer assigns it.
	 */
	registerDisplayDevice: t.drizzleField({
		type: DisplayDeviceRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			if (!isDisplayKiosk(ctx)) {
				throw new GraphQLError('Only display devices may register');
			}

			await db
				.insert(schema.displayDevice)
				.values({ id: args.id, lastSeenAt: new Date() })
				.onConflictDoUpdate({
					target: schema.displayDevice.id,
					set: { lastSeenAt: new Date() }
				});

			pubsub.updated(args.id);

			return db.query.displayDevice
				.findFirst(
					query(
						ctx.abilities.displayDevice.filter('read').merge({
							where: { id: args.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	/**
	 * Organizer assigns (or re-assigns / unassigns) a device. Passing an
	 * explicit `null` clears the field; omitting it leaves it unchanged.
	 */
	assignDisplayDevice: t.drizzleField({
		type: DisplayDeviceRef,
		args: {
			id: t.arg.id({ required: true }),
			conferenceId: t.arg.id(),
			committeeId: t.arg.id(),
			name: t.arg.string(),
			locale: t.arg({ type: displayDeviceLocaleEnum }),
			timezone: t.arg.string()
		},
		resolve: async (query, root, args, ctx) => {
			// Claiming/unassigning a device (including clearing it back to
			// unassigned) stays a global-admin action — conference admins/team
			// members may only edit settings on devices already assigned to
			// their conference. This also prevents a real crash: the `update`
			// ability only matches rows whose *current* conferenceId already
			// satisfies `isTeamInConference`, so letting a conference admin
			// change conferenceId would leave the row outside their own `read`
			// filter right after the write, and the read-back below would
			// throw instead of returning the updated row.
			if (args.conferenceId !== undefined && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only global admins can assign or unassign a display device');
			}

			const set: Partial<typeof schema.displayDevice.$inferInsert> = {};
			if (args.conferenceId !== undefined) set.conferenceId = args.conferenceId;
			if (args.committeeId !== undefined) set.committeeId = args.committeeId;
			if (args.name !== undefined) set.name = args.name;
			if (args.locale !== undefined) set.locale = args.locale;
			if (args.timezone !== undefined) set.timezone = args.timezone;
			// Clearing the conference also clears the committee — a committee
			// always belongs to a conference, so leaving committeeId set with a
			// null conferenceId would orphan the FK.
			if (args.conferenceId === null) set.committeeId = null;

			if (args.committeeId) {
				const committee = await db.query.committee.findFirst({
					where: { id: args.committeeId }
				});
				if (!committee) {
					throw new GraphQLError('Committee not found');
				}
				const effectiveConferenceId =
					args.conferenceId !== undefined
						? args.conferenceId
						: (
								await db.query.displayDevice.findFirst({
									where: { id: args.id }
								})
							)?.conferenceId;
				if (committee.conferenceId !== effectiveConferenceId) {
					throw new GraphQLError('Committee does not belong to the assigned conference');
				}
			}

			await db
				.update(schema.displayDevice)
				.set(set)
				.where(
					ctx.abilities.displayDevice.filter('update').merge({ where: { id: args.id } }).sql.where
				);

			pubsub.updated(args.id);

			return db.query.displayDevice
				.findFirst(
					query(
						ctx.abilities.displayDevice.filter('read').merge({
							where: { id: args.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	/** Organizer revokes (or restores) a device. Revoked devices fall back to the pairing screen. */
	setDisplayDeviceRevoked: t.drizzleField({
		type: DisplayDeviceRef,
		args: {
			id: t.arg.id({ required: true }),
			revoked: t.arg.boolean({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			await db
				.update(schema.displayDevice)
				.set({ revoked: args.revoked })
				.where(
					ctx.abilities.displayDevice.filter('update').merge({ where: { id: args.id } }).sql.where
				);

			pubsub.updated(args.id);

			return db.query.displayDevice
				.findFirst(
					query(
						ctx.abilities.displayDevice.filter('read').merge({
							where: { id: args.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	/**
	 * Permanently remove a device row. Only ever reachable for already-revoked
	 * devices — enforced by the `delete` ability's `revoked: true` clause, not
	 * just the UI hiding the button — so `.returning()` coming back empty
	 * unambiguously means "not revoked (or not permitted)", not a fluke.
	 */
	deleteDisplayDevice: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const deleted = await db
				.delete(schema.displayDevice)
				.where(
					ctx.abilities.displayDevice.filter('delete').merge({ where: { id: args.id } }).sql.where
				)
				.returning({ id: schema.displayDevice.id });

			assertFirstEntryExists(deleted);

			pubsub.removed();

			return true;
		}
	})
}));
