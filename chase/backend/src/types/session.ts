import * as m from "fastify";
/*
Typescript type for the session.
This is not checked at runtime and should be strictly complied with to prevent type drifting
*/

declare module "fastify" {
  /**
        Variables set per session
     */
  interface Session {
    /**
        If the user is authenticated this object contains various fields that are obtained from the authentication
        */
    authentication?: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      pronouns: string;
    };
  }
}

export { m };
