import {FastifyRequest, FastifyReply} from "fastify";
import {NowRequestHandler} from "fastify-now";
import {TypeOf, ZodTypeAny} from "zod";


interface Paramteres<RequestType extends ZodTypeAny, ReplyType extends ZodTypeAny> {
    requestSchema?: RequestType,
    replySchema?: ReplyType,
    handler: NowRequestHandler<{Body: TypeOf<RequestType>, Reply: TypeOf<ReplyType>}>;
    beforeRequestHook?: (req: FastifyRequest, rep: FastifyReply) => Promise<void>;
    description?: string;
}

/**
 * Helper function to create and correctly configure an endpoint. Example use:
 * ```
 * export const GET = makeEndpoint({
 *   description: "List all available conferences",
 *   beforeRequestHook: authenticated,
 *   replySchema: z.array(ConferenceSchema),
 *   handler: async () => {
 *     return await db.conference.findMany();
 *   },
 *   });
 * ```
 */
export function makeEndpoint<RequestType extends ZodTypeAny, ReplyType extends ZodTypeAny>({requestSchema, replySchema, handler, beforeRequestHook, description}: Paramteres<RequestType, ReplyType>) {

    const nowHandler = handler as unknown as NowRequestHandler<{
        Body: RequestType;
        Reply: ReplyType;
    }>;

    nowHandler.opts = {
        onRequest: beforeRequestHook,
        schema: {
            description,
            body: requestSchema,
            response: replySchema ? {
                200: replySchema,
            } : undefined,
        },
    };

    return nowHandler;
}