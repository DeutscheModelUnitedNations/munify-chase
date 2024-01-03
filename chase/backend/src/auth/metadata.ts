/**
 * Auth related user data
 */
export interface User {
  id: string;
  email: string;
  family_name: string;
  given_name: string;
  locale: string;
  pronouns: string;
}

/**
 * How the auth system references conferences
 */
export type ConferenceId = string;
/**
 * How the auth system references countries
 */
export type CountryId = string; /**
 * How the auth system references organizations (like greenpeace etc.)
 */
export type OrganizationId = string;

/**
 * A commitee how it is referenced by the authentication system
 */
export type Commitee = {
  id: string;
  conference: ConferenceId;
};

/**
 * A nsa how it is referenced by the authentication system
 */
export interface NonStateActor {
  conference: ConferenceId;
  organization: OrganizationId;
}

/**
 * A delegate how it is referenced by the authentication system
 */
export interface Delegate {
  conference: ConferenceId;
  commitee: Commitee;
  country: CountryId;
}

/**
 * A secretary member how it is referenced by the authentication system
 */
export interface SecretaryMember {
  conference: ConferenceId;
}

/**
 * A committee chair how it is referenced by the authentication system
 */
export interface Chair {
  commitee: Commitee;
}

/**
 * A conference admin how it is referenced by the authentication system
 */
export interface ConferenceAdmin {
  conference: ConferenceId;
}

/**
 * A conference visitor how it is referenced by the authentication system
 */
export interface Visitor {
  conference: ConferenceId;
}
