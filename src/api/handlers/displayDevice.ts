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
	return {
		where: {
			OR: [
				// See note on `read` above — conference admins/team members can
				// only mutate devices already assigned to one of their
				// conferences, not unassigned ones. Same predicate as `read` so
				// nobody can ever see an entry they aren't also allowed to edit.
				{ conferenceId: { isNotNull: true }, ...isTeamInConference(ctx) },
				// Lets whoever provisioned a still-unassigned device claim it —
				// see assignDisplayDevice's resolver for the actual "which
				// conference" check, which this filter can't express (it only
				// sees the row's *current* state, not the proposed new value).
				{ conferenceId: { isNull: true }, provisionedByUserId: ctx.mustBeLoggedIn().sub }
			]
		}
	};
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
	 * id. Only a device-flow (kiosk) session may register — see
	 * isDisplayKiosk() and kioskWriteGuard.ts, which this mutation is
	 * allowlisted in. Creates the row unassigned; it stays inert (kiosk
	 * shows a pairing QR) until an organizer assigns it.
	 *
	 * Also (re)stamps `provisionedByUserId` with whoever is currently signed
	 * into this device, every call — not insert-only — so it always reflects
	 * whoever most recently completed the device flow here, not just whoever
	 * happened to be first. That's who assignDisplayDevice lets do the
	 * initial conference claim below.
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

			const provisionedByUserId = ctx.mustBeLoggedIn().sub;
			await db
				.insert(schema.displayDevice)
				.values({ id: args.id, lastSeenAt: new Date(), provisionedByUserId })
				.onConflictDoUpdate({
					target: schema.displayDevice.id,
					set: { lastSeenAt: new Date(), provisionedByUserId }
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
			// Re-assigning or unassigning an *already-claimed* device stays a
			// global-admin action. The one exception: whoever most recently
			// provisioned a device (registerDisplayDevice) may perform its
			// *initial* claim — set conferenceId on a still-unassigned row —
			// for one of their own ADMIN/TEAM conferences. This is checked here
			// against the row's current state and the proposed new value
			// together, which the declarative `update` ability can't do (it
			// only ever sees the row as it exists right now, never the args) —
			// that ability just makes sure the write below can even touch this
			// row, this is "and only into a conference you're allowed to add
			// devices to".
			if (args.conferenceId !== undefined && !isGlobalAdmin(ctx)) {
				const device = await db.query.displayDevice.findFirst({
					where: { id: args.id }
				});
				if (!device) {
					throw new GraphQLError('Display device not found');
				}
				if (device.conferenceId !== null) {
					throw new GraphQLError('Only global admins can reassign or unassign a display device');
				}
				const userId = ctx.mustBeLoggedIn().sub;
				if (device.provisionedByUserId !== userId) {
					throw new GraphQLError('Only the team member who provisioned this device can claim it');
				}
				if (args.conferenceId !== null) {
					const membership = await db.query.conferenceUser.findFirst({
						where: {
							conferenceId: args.conferenceId,
							conferenceUserType: { in: ['ADMIN', 'TEAM'] },
							user: { id: userId }
						}
					});
					if (!membership) {
						throw new GraphQLError('You are not an admin or team member of that conference');
					}
				} else {
					// Clearing an already-unassigned device to `null` is a no-op
					// a non-admin has no reason to send, and "unassign" is
					// otherwise an admin-only action — reject it explicitly
					// rather than silently no-op-ing.
					throw new GraphQLError('Only global admins can unassign a display device');
				}
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
