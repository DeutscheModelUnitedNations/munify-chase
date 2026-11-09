import { abilityBuilder, object, query, schemaBuilder } from '#api/rumble';
import { isGlobalAdmin } from '#api/services/authHelper';
import { GraphQLError } from 'graphql';
import { z } from 'zod';
import {
	approveLink,
	freezeLink,
	receiveLinkRequest,
	rejectLink
} from '#api/services/link/pairing';

/**
 * The link to a MUNify DELEGATOR instance (`docs/plans/delegator-link.md`). Global admins read it,
 * but never its tokens; everyone reads where an active link points, for the "managed by
 * DELEGATOR" links back.
 */
abilityBuilder.instanceLink
	.allow('read')
	.when((ctx) =>
		isGlobalAdmin(ctx) ? { columns: { inboundTokenHash: false, outboundToken: false } } : undefined
	);
abilityBuilder.instanceLink.allow('read').when(() => ({
	where: { status: 'ACTIVE' },
	columns: { id: true, remoteUrl: true, status: true }
}));

object({ table: 'instanceLink' });

query({ table: 'instanceLink' });

/** An instance's origin: https, or http on this machine (development). */
const originSchema = z
	.url()
	.refine((value) => {
		const url = new URL(value);
		return (
			url.protocol === 'https:' ||
			(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
		);
	}, 'The URL has to use https.')
	.transform((value) => new URL(value).origin);

function assertGlobalAdmin(ctx: Parameters<typeof isGlobalAdmin>[0]) {
	if (!isGlobalAdmin(ctx)) throw new GraphQLError('Only global admins may manage the link.');
}

schemaBuilder.mutationFields((t) => ({
	requestDelegatorLink: t.field({
		description:
			'Called by a MUNify DELEGATOR instance to ask for a link. It stays pending until a global admin approves it here.',
		type: 'Boolean',
		args: {
			delegatorUrl: t.arg.string({ required: true }).validate(originSchema),
			token: t.arg.string({ required: true }).validate(z.string().min(32)),
			confirmationCode: t.arg.string({ required: true }).validate(z.string().length(6))
		},
		resolve: async (_root, args) => {
			await receiveLinkRequest({
				remoteUrl: args.delegatorUrl,
				token: args.token,
				confirmationCode: args.confirmationCode
			});
			return true;
		}
	}),

	approveDelegatorLink: t.field({
		description:
			'Approves the pending link request once the code matches the one DELEGATOR shows. Every DELEGATOR conference that has not ended then appears here.',
		type: 'Boolean',
		args: { confirmationCode: t.arg.string({ required: true }) },
		resolve: async (_root, args, ctx) => {
			assertGlobalAdmin(ctx);
			await approveLink({ confirmationCode: args.confirmationCode });
			return true;
		}
	}),

	rejectDelegatorLink: t.field({
		description: 'Discards the pending link request.',
		type: 'Boolean',
		resolve: async (_root, _args, ctx) => {
			assertGlobalAdmin(ctx);
			await rejectLink();
			return true;
		}
	}),

	unlinkDelegator: t.field({
		description:
			'Ends the link and freezes both sides: what was synced stays, as rows of this instance. Called by a global admin here, or by DELEGATOR when it unlinks.',
		type: 'Boolean',
		resolve: async (_root, _args, ctx) => {
			const caller = await ctx.linkCaller();
			const byRemote = caller?.status === 'ACTIVE';
			if (!byRemote) assertGlobalAdmin(ctx);
			await freezeLink({ notifyRemote: !byRemote });
			return true;
		}
	})
}));
