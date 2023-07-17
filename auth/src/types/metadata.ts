import {CountryCode, NSACodes} from "./countrycodes";

export type MetadataKeys = "pronouns" | "nonStateActorGrants" | "representativeGrants" | "secretaryMemberGrants" | "chairGrants" | "conferenceAdminGrants" | "visitorGrants";

export interface UserMetadata {
  pronouns: string;
  nonStateActorGrants: NonStateActor[];
  representativeGrants: Representative[];
  secretaryMemberGrants: SecretaryMember[];
  chairGrants: Chair[];
  conferenceAdminGrants: ConferenceAdmin[];
  visitorGrants: Visitor[];
}

export type Conference = string;
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
