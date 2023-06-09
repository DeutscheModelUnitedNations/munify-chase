export * from "fastify";

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
        The email of the user, unique per user
     */
    email: string;
  }
}
