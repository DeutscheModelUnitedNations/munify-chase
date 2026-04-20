import { schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { basics } from './basics';
import { and, eq } from 'drizzle-orm';

const { ref, pubsub, table } = basics('user');

// abilityBuilder.user.allow('read').when(({ oidc }) => {
// 	if (oidc?.user) {
// 		return {
// 			where: { id: oidc.user.sub }
// 		};
// 	}
// });

abilityBuilder.user.allow('read');
// .when(({ mustBeLoggedIn }) => {
// 	const user = mustBeLoggedIn();
// 	if (user?.email && isDMUNEmail(user.email)) {
// 		console.log("allowed");
// 		return 'allow';
// 	}
// });

const UserClaims = schemaBuilder
	.objectRef<{
		id: string;
		givenName: string | null;
		familyName: string | null;
		email: string | null;
		preferredUsername: string | null;
		locale: string | null;
	}>('UserClaims')
	.implement({
		fields: (t) => ({
			id: t.exposeString('id'),
			givenName: t.exposeString('givenName', { nullable: true }),
			familyName: t.exposeString('familyName', { nullable: true }),
			email: t.exposeString('email', { nullable: true }),
			preferredUsername: t.exposeString('preferredUsername', { nullable: true }),
			locale: t.exposeString('locale', { nullable: true })
		})
	});

schemaBuilder.queryFields((t) => ({
	isGlobalAdmin: t.boolean({
		resolve: (root, args, ctx) => {
			return isGlobalAdmin(ctx);
		}
	}),
	currentUserClaims: t.field({
		type: UserClaims,
		resolve: (_root, _args, ctx) => {
			const u = ctx.mustBeLoggedIn();
			return {
				id: u.sub,
				givenName: u.given_name ?? null,
				familyName: u.family_name ?? null,
				email: u.email ?? null,
				preferredUsername: u.preferred_username ?? null,
				locale: u.locale ?? null
			};
		}
	})
}));
