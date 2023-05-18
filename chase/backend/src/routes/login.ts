import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      return { hello: "world" };
    },
  );
}
