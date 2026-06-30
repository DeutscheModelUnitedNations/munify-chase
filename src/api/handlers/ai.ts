import { db } from '$api/db/db';
import { makeAICall } from '$api/services/ai';
import { schemaBuilder } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { GraphQLError } from 'graphql';
import z from 'zod';
import { jsonSchema, Output } from 'ai';
import type { Context } from '$api/context';
import { configPrivate } from '$lib/config/private';

const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 4; // 4 minutes
const RATE_LIMIT_MAX = 100;

const userRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): void {
	const now = Date.now();
	const entry = userRequestCounts.get(userId);

	if (!entry || now > entry.resetAt) {
		userRequestCounts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return;
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		throw new GraphQLError(
			`AI rate limit exceeded. Maximum ${RATE_LIMIT_MAX} requests per minute.`
		);
	}

	entry.count++;
}

async function requireChairAccess(ctx: Context): Promise<void> {
	if (isGlobalAdmin(ctx)) return;
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email required');
	const now = new Date();
	const member = await db.query.conferenceUser.findFirst({
		where: {
			userEmail: user.email,
			OR: [{ conferenceUserType: 'ADMIN' }, { conferenceUserType: 'TEAM' }]
		},
		with: {
			conference: {
				where: {
					RAW: (t, { and, or, isNull, lte, gte }) =>
						and(
							or(isNull(t.startDate), lte(t.startDate, now)),
							or(isNull(t.endDate), gte(t.endDate, now))
						)!
				}
			}
		}
	});
	if (!member?.conference) {
		throw new GraphQLError('Only chairs of an active conference can use AI features');
	}
}

const AiMessageInput = schemaBuilder
	.inputRef<{
		role: 'system' | 'user' | 'assistant';
		content: string;
	}>('AiMessageInput')
	.implement({
		fields: (t) => ({
			role: t.field({
				type: schemaBuilder.enumType('AiMessageRole', {
					values: ['system', 'user', 'assistant'] as const
				}),
				required: true
			}),
			content: t.string({ required: true, validate: z.string().max(10_000) })
		})
	});

schemaBuilder.queryFields((t) => ({
	aiCall: t.field({
		type: 'String',
		nullable: true,
		args: {
			messages: t
				.arg({ type: [AiMessageInput], required: true })
				.validate(z.array(z.any()).min(1).max(20)),
			temperature: t.arg.float().validate(z.number().min(0).max(2)),
			maxTokens: t.arg.int().validate(z.number().int().min(1).max(4096)),
			responseType: t.arg({
				type: schemaBuilder.enumType('AiResponseType', {
					values: ['text', 'json'] as const
				})
			}),
			responseJSONSchema: t.arg({ type: 'JSON' })
		},
		resolve: async (_root, args, ctx) => {
			await requireChairAccess(ctx);
			if (!isGlobalAdmin(ctx)) {
				const user = ctx.mustBeLoggedIn();
				if (user.email) checkRateLimit(user.email);
			}

			const result = await makeAICall({
				messages: args.messages.map((m) => ({
					role: m.role,
					content: m.content
				})),
				temperature: args.temperature ?? 0.1,
				maxOutputTokens: args.maxTokens ?? 500,
				output:
					args.responseType === 'json'
						? args.responseJSONSchema
							? Output.object({
									schema: jsonSchema(args.responseJSONSchema)
								})
							: Output.json()
						: Output.text()
			});
			return result?.text ?? null;
		}
	}),
	hasAiProviders: t.boolean({
		resolve: async (_root, _args, ctx) => {
			await requireChairAccess(ctx);
			return (configPrivate.AI_PROVIDERS?.length ?? 0) > 0;
		}
	})
}));
