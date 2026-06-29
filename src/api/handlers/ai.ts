import { schemaBuilder } from '$api/rumble';
import {
	backendClassifyObsolescence,
	backendEvaluateAndSuggestRewrite,
	backendRankAmendmentsByImpact,
	isBackendAiAvailable
} from '$api/services/ai';

const ObsolescenceResult = schemaBuilder
	.objectRef<{ obsolete: boolean; reason: string }>('ObsolescenceResult')
	.implement({
		fields: (t) => ({
			obsolete: t.exposeBoolean('obsolete'),
			reason: t.exposeString('reason')
		})
	});

const RewriteResult = schemaBuilder
	.objectRef<{ needsRewrite: boolean; reason: string; suggestion: string }>('RewriteResult')
	.implement({
		fields: (t) => ({
			needsRewrite: t.exposeBoolean('needsRewrite'),
			reason: t.exposeString('reason'),
			suggestion: t.exposeString('suggestion')
		})
	});

schemaBuilder.queryFields((t) => ({
	aiBackendAvailable: t.boolean({
		resolve: () => isBackendAiAvailable()
	})
}));

schemaBuilder.mutationFields((t) => ({
	aiClassifyObsolescence: t.field({
		type: ObsolescenceResult,
		nullable: true,
		args: {
			triggerOld: t.arg.string({ required: true }),
			triggerNew: t.arg.string({ required: true }),
			subjectOld: t.arg.string({ required: true }),
			subjectNew: t.arg.string({ required: true }),
			clauseRef: t.arg.string({ required: true }),
			documentNumber: t.arg.string({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			ctx.mustBeLoggedIn();
			if (!isBackendAiAvailable()) return null;
			return backendClassifyObsolescence(
				args.triggerOld,
				args.triggerNew,
				args.subjectOld,
				args.subjectNew,
				args.clauseRef,
				args.documentNumber
			);
		}
	}),

	aiRankAmendmentsByImpact: t.stringList({
		args: {
			list: t.arg.string({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			ctx.mustBeLoggedIn();
			const result = await backendRankAmendmentsByImpact(args.list);
			return result.ranked;
		}
	}),

	aiEvaluateAndSuggestRewrite: t.field({
		type: RewriteResult,
		args: {
			triggerOld: t.arg.string({ required: true }),
			triggerNew: t.arg.string({ required: true }),
			subjectNew: t.arg.string({ required: true }),
			clauseRef: t.arg.string({ required: true }),
			documentNumber: t.arg.string({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			ctx.mustBeLoggedIn();
			return backendEvaluateAndSuggestRewrite(
				args.triggerOld,
				args.triggerNew,
				args.subjectNew,
				args.clauseRef,
				args.documentNumber
			);
		}
	})
}));
