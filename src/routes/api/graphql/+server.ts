import { yogaInstance } from '$api/http';
// import { makeHooks } from 'graphql-ws/use/crossws';
// import type { Socket, RequestEvent } from '@sveltejs/kit';

export { yogaInstance as GET, yogaInstance as POST };

// export const socket: Socket = makeHooks({
// 	execute: (args: any) => args.rootValue.execute(args),
// 	subscribe: (args: any) => args.rootValue.subscribe(args),
// 	onSubscribe: async (ctx, _id, params) => {
// 		const { schema, execute, subscribe, contextFactory, parse, validate } =
// 			yogaInstance.getEnveloped({
// 				...ctx,
// 				req: ctx.extra.request,
// 				socket: ctx.extra.socket,
// 				params
// 			});

// 		const args = {
// 			schema,
// 			operationName: params.operationName,
// 			document: parse(params.query),
// 			variableValues: params.variables,
// 			contextValue: await contextFactory(),
// 			rootValue: {
// 				execute,
// 				subscribe
// 			}
// 		};

// 		const errors = validate(args.schema, args.document);
// 		if (errors.length) return errors;
// 		return args;
// 	}
// });
