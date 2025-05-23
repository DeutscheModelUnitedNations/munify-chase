import { db } from '$api/db/db';
import {
	abilityBuilder,
	object,
	query,
	pubsub as rumblePubsub,
	arg as rumbleArg
} from '$api/rumble';
import { ConferenceMemberRef, ConferenceMemberWhereInput } from './conferenceMember';

abilityBuilder.conference.allow('read');
// .when(({ user }) => {
// 	if (user) {
// 		return {};
// 	}
// });

const ref = object({
	table: 'conference',
	adjust: (t) => ({
		uniqueNSAConferenceMembers: t.drizzleField({
			type: [ConferenceMemberRef],
			description:
				'Returns a conference member for each existent non state actor. Useful to display a non duplicated list of non state actors.',
			args: {
				where: t.arg({ type: ConferenceMemberWhereInput, required: false })
			},
			// TODO
			// smartSubscription: true,
			// subscribe: (subscriptions, root, args, ctx, info) => {
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'created'
			// 	});
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'removed'
			// 	});
			// },
			resolve: async (query, _root, args, ctx, _info) => {
				const touchedNSARepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...ctx.abilities.conferenceMember.filter('read', {
								inject: {
									where: {
										...args.where,
										representation: {
											type: 'NSA'
										}
									}
								}
							}).query.many,
							with: {
								representation: true
							}
						})
					)
				).filter((member) => {
					if (touchedNSARepresentation.has(member.representation!.id!)) {
						return false;
					}
					touchedNSARepresentation.add(member.representation!.id!);
					return true;
				});
			}
		}),
		uniqueUNConferenceMembers: t.drizzleField({
			type: [ConferenceMemberRef],
			description:
				'Returns a conference member for each existent non state actor. Useful to display a non duplicated list of non state actors.',
			args: {
				where: t.arg({ type: ConferenceMemberWhereInput, required: false })
			},
			// TODO
			// smartSubscription: true,
			// subscribe: (subscriptions, root, args, ctx, info) => {
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'created'
			// 	});
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'removed'
			// 	});
			// },
			resolve: async (query, _root, args, ctx, _info) => {
				const touchedNSARepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...ctx.abilities.conferenceMember.filter('read', {
								inject: {
									where: {
										...args.where,
										representation: {
											type: 'UN'
										}
									}
								}
							}).query.many,
							with: {
								representation: true
							}
						})
					)
				).filter((member) => {
					if (touchedNSARepresentation.has(member.representation!.id!)) {
						return false;
					}
					touchedNSARepresentation.add(member.representation!.id!);
					return true;
				});
			}
		}),
		uniqueConferenceMembers: t.drizzleField({
			type: [ConferenceMemberRef],
			description:
				'Returns a conference member for each existent non state actor. Useful to display a non duplicated list of non state actors.',
			args: {
				where: t.arg({ type: ConferenceMemberWhereInput, required: false })
			},
			// TODO
			// smartSubscription: true,
			// subscribe: (subscriptions, root, args, ctx, info) => {
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'created'
			// 	});
			// 	registerOnInstance({
			// 		instance: subscriptions,
			// 		action: 'removed'
			// 	});
			// },
			resolve: async (query, _root, args, ctx, _info) => {
				const touchedNSARepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...ctx.abilities.conferenceMember.filter('read', {
								inject: {
									where: {
										...args.where,
										representation: {
											OR: [{ type: 'UN' }, { type: 'NSA' }]
										}
									}
								}
							}).query.many,
							with: {
								representation: true
							}
						})
					)
				).filter((member) => {
					if (touchedNSARepresentation.has(member.representation!.id!)) {
						return false;
					}
					touchedNSARepresentation.add(member.representation!.id!);
					return true;
				});
			}
		})
	})
});

const pubsub = rumblePubsub({ table: 'committee' });
const arg = rumbleArg({ table: 'committee' });
query({
	table: 'conference'
});

export const ConferenceRef = ref;
