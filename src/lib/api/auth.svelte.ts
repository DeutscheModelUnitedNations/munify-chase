import { client } from "./rumbleClient/client";

export const authenticatedUserPromise = async () => {
  try {
    const res = await client.query.me({
      email: true,
      family_name: true,
      given_name: true,
      locale: true,
      phone: true,
      preferred_username: true,
      sub: true,
    });
    return res;
  } catch (_error) {}
};
