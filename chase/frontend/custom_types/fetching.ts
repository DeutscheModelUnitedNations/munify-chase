export type CommitteeCategory = "COMMITTEE" | "CRISIS" | "ICJ"

export interface Committee {
    id: string;
    name: string;
    abbreviation: string;
    category: CommitteeCategory;
    conferenceId: string;
    isSubcommittee: boolean;
    parentId: string | null;
};

export interface CreateCommitteePayload {
    name: string;
    abbreviation: string;
    category: CommitteeCategory;
    isSubcommittee: boolean;
    parentId?: string;
  }