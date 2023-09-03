import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { introspect } from "auth";

export const auth = (app: Elysia) => {
  return app
    .guard({
      headers: t.Object({
        authorization: t.String(),
      }),
    })
    .use(bearer())
    .derive(async ({ bearer }) => {
      return {
        auth: await introspect(bearer),
      };
    })
    .guard({
      beforeHandle: [
        async ({ auth }) => {
          if (!auth) {
            return new Response(null, { status: 401 });
          }
        },
      ],
    });
};
