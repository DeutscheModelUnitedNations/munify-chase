'use client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { server } from '../main';
import { Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// use typebox to define our session type
export const sessionSchema = Type.Object({
  authentication: Type.Object({
    userId: Type.Number(),
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    lastName: Type.String(),
    pronouns: Type.String(),
  }),
});

// compile schema to validate tokens at req time
const compiledSessionSchema = TypeCompiler.Compile(sessionSchema);

// create ts type from typebox
type SessionType = Static<typeof sessionSchema>;

// augment the fastify module to provide intellisense for the session object on the req in handlers
declare module 'fastify' {
  // rome-ignore lint/suspicious/noRedeclare: <explanation>
  interface FastifyRequest {
    session: SessionType;
  }
}

// TODO investigate if this is the way
// decorate to optimize the js engine
// https://www.fastify.io/docs/latest/Reference/Decorators/
// decorating with a shared object is ok here, since we replace the value at req time with a new object
const defaultSessionValue: SessionType = {
  authentication: {
    email: '',
    firstName: '',
    lastName: '',
    pronouns: '',
    userId: 0,
  },
};
server.decorateRequest('session', defaultSessionValue);

// fetch the token specifications from keycloak
const JWKSet = createRemoteJWKSet(
  new URL(`${process.env.KEYCLOAK_REALM_URL}/.well-known/openid-configuration`)
);

/**
 * This hook prevents the access to the route when there is no valid session or the user is not authenticated
 */
export async function authenticated(
  req: FastifyRequest,
  rep: FastifyReply,
  done: (error?: FastifyError) => void
) {
  if (req.headers.authorization === undefined || !req.headers.authorization.startsWith('Bearer')) {
    rep.code(401).send(new Error('Unauthorized: Bearer missing'));
    return;
  }

  const token = req.headers.authorization.substring('Bearer '.length);

  try {
    console.log(token);

    const { payload } = await jwtVerify(token, JWKSet);
    console.log(payload);
    if (!payload.sub) {
      rep.code(401).send(new Error('Unauthorized: Sub undefined'));
      return;
    }

    // Continue here. Check how to manipulate the type and strongly type the session data
    /*
      {
  exp: 1687519483,
  iat: 1687519183,
  auth_time: 1687519182,
  jti: '75a12e28-a8b3-4025-81a4-24e8e82d5f8f',
  iss: 'http://localhost:6677/realms/dmun',
  aud: 'account',
  sub: '36f9a7b2-ac4f-4b53-a92c-5ebeec214dc9',
  typ: 'Bearer',
  azp: 'chase',
  nonce: '865a8bd3-00e6-436c-b496-a0f6268d810e',
  session_state: '8d25fa16-0a0a-4eb1-971b-2e7de938a9f2',
  acr: '1',
  'allowed-origins': [ 'http://localhost:3000' ],
  realm_access: {
    roles: [
      'offline_access',
      'uma_authorization',
      'default-roles-dmun-extern'
    ]
  },
  resource_access: { account: { roles: [Array] } },
  scope: 'openid email profile',
  sid: '8d25fa16-0a0a-4eb1-971b-2e7de938a9f2',
  email_verified: true,
  name: 'TestVorname TestNachname',
  preferred_username: 'test@test.de',
  given_name: 'TestVorname',
  family_name: 'TestNachname',
  email: 'test@test.de'
}
    */
    // const sessionData = JSON.parse(payload.sub);
    // if (!compiledSessionSchema.Check(sessionData)) {
    //   rep.code(401).send(new Error("Unauthorized: Malformed token"));
    //   return;
    // }

    // req.session = sessionData;

    compiledSessionSchema;
  } catch (error) {
    console.error(error);
    rep.code(401).send(new Error('Unauthorized: JWT not verified'));
  }

  done();
}
