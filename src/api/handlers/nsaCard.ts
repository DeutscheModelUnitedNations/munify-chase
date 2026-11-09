import { db } from '#api/db/db';
import { schemaBuilder } from '#api/rumble';
import { isAdmin } from '#api/services/authHelper';
import { identityKeys, ownNsaCards, reprintOwnNsaCard } from '#api/services/nsaCards';
import { assertFindFirstExists } from '@m1212e/rumble';

/**
 * NSA cards and the keys their codes are checked with (`docs/plans/delegator-link.md`). The cards
 * here are the ones this instance prints while no DELEGATOR is linked.
 */

type SigningKeyShape = { kid: number; publicKey: string };

const SigningKey = schemaBuilder.objectRef<SigningKeyShape>('SigningKey');
schemaBuilder.objectType(SigningKey, {
	description: 'A public key signed codes are checked against.',
	fields: (t) => ({
		kid: t.exposeInt('kid', { description: 'The key id codes name in their `kid` header.' }),
		publicKey: t.exposeString('publicKey', { description: 'Ed25519, raw and base64url.' })
	})
});

const IdentityKeys = schemaBuilder.objectRef<{
	delegator: SigningKeyShape[];
	own: SigningKeyShape[];
}>('IdentityKeys');
schemaBuilder.objectType(IdentityKeys, {
	description:
		'The public keys NSA nametags and cards are checked against; the scanner keeps them for offline use.',
	fields: (t) => ({
		delegator: t.expose('delegator', {
			type: [SigningKey],
			description: "The linked DELEGATOR's keys (its `signedCodeKeys`)."
		}),
		own: t.expose('own', {
			type: [SigningKey],
			description: "This instance's keys, for its own cards."
		})
	})
});

const asList = (keys: ReadonlyMap<number, string>) =>
	[...keys].map(([kid, publicKey]) => ({ kid, publicKey }));

const NsaCard = schemaBuilder.objectRef<Awaited<ReturnType<typeof ownNsaCards>>[number]>('NsaCard');
schemaBuilder.objectType(NsaCard, {
	fields: (t) => ({
		conferenceUserId: t.exposeID('conferenceUserId'),
		name: t.exposeString('name'),
		nsaName: t.exposeString('nsaName', { nullable: true }),
		nsaIcon: t.exposeString('nsaIcon', { nullable: true }),
		cardNumber: t.exposeInt('cardNumber'),
		code: t.exposeString('code', {
			description: 'The signed card code (kind `nsaCard`), for the QR code.'
		})
	})
});

/** Only a conference's admins print its cards (NOT_FOUND otherwise). */
async function assertAdminOfConference({
	ctx,
	conferenceId
}: {
	ctx: Parameters<typeof isAdmin>[0];
	conferenceId: string;
}) {
	await db.query.conference
		.findFirst({ where: { id: conferenceId, ...isAdmin(ctx) }, columns: { id: true } })
		.then(assertFindFirstExists);
}

schemaBuilder.queryFields((t) => ({
	identityKeys: t.field({
		type: IdentityKeys,
		resolve: async (_root, _args, ctx) => {
			ctx.mustBeLoggedIn();
			const keys = await identityKeys();
			return { delegator: asList(keys.delegator), own: asList(keys.own) };
		}
	})
}));

schemaBuilder.mutationFields((t) => ({
	issueNsaCards: t.field({
		description:
			"The printable cards of a conference's NSAs, all or the given ones, signed by this instance (admins). Refused for a conference synced from DELEGATOR, which prints those. A mutation so no cache hands back old codes; it writes nothing.",
		type: [NsaCard],
		args: {
			conferenceId: t.arg.id({ required: true }),
			conferenceUserIds: t.arg.idList()
		},
		resolve: async (_root, args, ctx) => {
			const conferenceId = String(args.conferenceId);
			await assertAdminOfConference({ ctx, conferenceId });
			return ownNsaCards({ conferenceId, conferenceUserIds: args.conferenceUserIds?.map(String) });
		}
	}),

	reprintNsaCard: t.field({
		description:
			"A new card for a lost one: raises the NSA's card number, so the earlier cards stop scanning (admins).",
		type: NsaCard,
		args: {
			conferenceId: t.arg.id({ required: true }),
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			const conferenceId = String(args.conferenceId);
			await assertAdminOfConference({ ctx, conferenceId });
			return reprintOwnNsaCard({ conferenceId, conferenceUserId: String(args.conferenceUserId) });
		}
	})
}));
