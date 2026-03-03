import { db } from '$api/db/db';
import {
	abilityBuilder,
	object,
	query,
	pubsub as rumblePubsub,
	arg as rumbleArg
} from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { ConferenceMemberRef, ConferenceMemberWhereInput } from './conferenceMember';

abilityBuilder.conference.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();

	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.conference.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({
	table: 'conference',
	adjust: (t) => ({
		uniqueConferenceMembers: t.drizzleField({
			type: [ConferenceMemberRef],
			description:
				'Returns a conference member for each existent representation. Useful to display a non duplicated list of non state actors.',
			args: {
				where: t.arg({ type: ConferenceMemberWhereInput })
			},
			resolve: async (query, parent, args, ctx, _info) => {
				const touchedRepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...ctx.abilities.conferenceMember.filter('read', {
								inject: {
									where: {
										...args.where,
										conferenceId: parent.id
									}
								}
							}).query.many,
							with: {
								representation: true
							}
						})
					)
				).filter((member) => {
					if (touchedRepresentation.has(member.representation!.id!)) {
						return false;
					}
					touchedRepresentation.add(member.representation!.id!);
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
