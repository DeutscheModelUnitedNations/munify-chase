import { CountryCode, NSACodes } from "./countrycodes";

/**
 * User specific data
 */
export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  pronouns: string;
}

export type Conference = number;
export type Commitee = {
  id: string;
  conference: Conference;
};

export interface NonStateActor {
  conference: Conference;
  organization: NSACodes;
}

export interface Representative {
  conference: Conference;
  commitee: Commitee;
  country: CountryCode;
}

export interface SecretaryMember {
  conference: Conference;
}

export interface Chair {
  commitee: Commitee;
}

export interface ConferenceAdmin {
  conference: Conference;
}

export interface Visitor {
  conference: Conference;
}
