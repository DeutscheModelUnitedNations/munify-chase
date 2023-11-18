import { Alpha3Code } from "./custom_types";

// Structure types
export type CommitteeCategory = "COMMITTEE" | "CRISIS" | "ICJ";
export interface Committee {
  id: string;
  name: string;
  abbreviation: string;
  category: CommitteeCategory;
  conferenceId: string;
  isSubcommittee: boolean;
  parentId: string | null;
  Delegates: {
    id: string;
    delegationId: string;
    committeeId: string;
  }[]
}

export interface CreateCommitteePayload {
  name: string;
  abbreviation: string;
  category: CommitteeCategory;
  isSubcommittee: boolean;
  parentId?: string;
}

// Teampool types
export type TeamRoles =
  | "ADMIN"
  | "CHAIR"
  | "COMMITTEE_ADVISOR"
  | "SECRETARIAT"
  | "PARTICIPANT_CARE"
  | "TEAM";

export type UserRoles =
  | "DELEGATE"
  | "OBSERVER"
  | "NON_STATE_ACTOR"
  | "PRESS_CORPS"
  | "GUEST";

export type Roles = TeamRoles | UserRoles;

export interface Teammember {
    id: string;
    conferenceId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: Roles;
    chair_committeeId: string | null;
    advisor_committeeId: string | null;
}

export interface CreateTeammemberPayload {
    firstName: string;
    lastName: string;
    email: string;
    role: TeamRoles;
}

export interface AgendaItem {
    id: string;
    committeeId: string;
    title: string;
    description?: string;
    SpeakersLists?: any;
    isActive: boolean;
}

export interface Delegation {
  id: string;
  name: string;
  alpha3Code: Alpha3Code;
  conferenceId: string;
  Delegates: {
    id: string;
    delegationId: string;
    committeeId: string;
  }[];
}

export interface CreateDelegationPayload {
  name: string;
  alpha3Code: Alpha3Code;
}