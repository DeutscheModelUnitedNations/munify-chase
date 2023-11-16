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