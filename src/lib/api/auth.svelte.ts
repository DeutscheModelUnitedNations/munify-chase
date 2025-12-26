import { client } from '$lib/api/rumbleClient/client';

export const authenticatedUser = async () =>
  client.query.me({
    email: true,
    family_name: true,
    given_name: true,
    locale: true,
    preferred_username: true,
    sub: true
  });
