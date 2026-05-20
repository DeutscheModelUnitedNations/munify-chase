import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { isAdmin, isDisplayKiosk, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

abilityBuilder.displayDevice.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) {
		return { where: {} };
	}
	// The shared kiosk account may read any non-revoked device row; per-device
	// scoping comes from the deviceId the kiosk queries, not the identity.
	if (isDisplayKiosk(ctx)) {
		return { where: { revoked: false } };
	}
	// Conference organizers see devices assigned to their conference only.
	// Unassigned devices are NOT included here: this `.when()` callback is
	// sync and can't await a "user-is-admin-somewhere" DB check, so without
	// a gate the `conferenceId IS NULL` arm would leak unassigned devices
	// (and via `update`, let any logged-in user claim them) to non-admins.
	// Claiming a freshly-paired Pi is therefore a global-admin action.
	return { where: { conference: isAdmin(ctx) } };
});

abilityBuilder.displayDevice.allow('update').when((ctx) => {
	if (isGlobalAdmin(ctx)) {
		return { where: {} };
	}
	// See note on `read` above — conference admins can only mutate devices
	// already assigned to their conference, not unassigned ones.
	return { where: { conference: isAdmin(ctx) } };
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
			name: t.arg.string()
		},
		resolve: async (query, root, args, ctx) => {
			const set: Partial<typeof schema.displayDevice.$inferInsert> = {};
			if (args.conferenceId !== undefined) set.conferenceId = args.conferenceId;
			if (args.committeeId !== undefined) set.committeeId = args.committeeId;
			if (args.name !== undefined) set.name = args.name;
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
	})
}));
