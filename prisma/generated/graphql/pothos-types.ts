/* eslint-disable */
import type { Prisma, User, ConferenceCreationToken, Conference, ConferenceMember, Committee, CommitteeMember, AgendaItem, SpeakersList, SpeakerOnList, Delegation, Nation, Message } from "../client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "conferenceMemberships" | "committeeMemberships" | "messages";
        ListRelations: "conferenceMemberships" | "committeeMemberships" | "messages";
        Relations: {
            conferenceMemberships: {
                Shape: ConferenceMember[];
                Name: "ConferenceMember";
                Nullable: false;
            };
            committeeMemberships: {
                Shape: CommitteeMember[];
                Name: "CommitteeMember";
                Nullable: false;
            };
            messages: {
                Shape: Message[];
                Name: "Message";
                Nullable: false;
            };
        };
    };
    ConferenceCreationToken: {
        Name: "ConferenceCreationToken";
        Shape: ConferenceCreationToken;
        Include: never;
        Select: Prisma.ConferenceCreationTokenSelect;
        OrderBy: Prisma.ConferenceCreationTokenOrderByWithRelationInput;
        WhereUnique: Prisma.ConferenceCreationTokenWhereUniqueInput;
        Where: Prisma.ConferenceCreationTokenWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Conference: {
        Name: "Conference";
        Shape: Conference;
        Include: Prisma.ConferenceInclude;
        Select: Prisma.ConferenceSelect;
        OrderBy: Prisma.ConferenceOrderByWithRelationInput;
        WhereUnique: Prisma.ConferenceWhereUniqueInput;
        Where: Prisma.ConferenceWhereInput;
        Create: {};
        Update: {};
        RelationName: "delegations" | "members" | "committees";
        ListRelations: "delegations" | "members" | "committees";
        Relations: {
            delegations: {
                Shape: Delegation[];
                Name: "Delegation";
                Nullable: false;
            };
            members: {
                Shape: ConferenceMember[];
                Name: "ConferenceMember";
                Nullable: false;
            };
            committees: {
                Shape: Committee[];
                Name: "Committee";
                Nullable: false;
            };
        };
    };
    ConferenceMember: {
        Name: "ConferenceMember";
        Shape: ConferenceMember;
        Include: Prisma.ConferenceMemberInclude;
        Select: Prisma.ConferenceMemberSelect;
        OrderBy: Prisma.ConferenceMemberOrderByWithRelationInput;
        WhereUnique: Prisma.ConferenceMemberWhereUniqueInput;
        Where: Prisma.ConferenceMemberWhereInput;
        Create: {};
        Update: {};
        RelationName: "conference" | "user";
        ListRelations: never;
        Relations: {
            conference: {
                Shape: Conference;
                Name: "Conference";
                Nullable: false;
            };
            user: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
        };
    };
    Committee: {
        Name: "Committee";
        Shape: Committee;
        Include: Prisma.CommitteeInclude;
        Select: Prisma.CommitteeSelect;
        OrderBy: Prisma.CommitteeOrderByWithRelationInput;
        WhereUnique: Prisma.CommitteeWhereUniqueInput;
        Where: Prisma.CommitteeWhereInput;
        Create: {};
        Update: {};
        RelationName: "conference" | "members" | "parent" | "subCommittees" | "messages" | "agendaItems";
        ListRelations: "members" | "subCommittees" | "messages" | "agendaItems";
        Relations: {
            conference: {
                Shape: Conference;
                Name: "Conference";
                Nullable: false;
            };
            members: {
                Shape: CommitteeMember[];
                Name: "CommitteeMember";
                Nullable: false;
            };
            parent: {
                Shape: Committee | null;
                Name: "Committee";
                Nullable: true;
            };
            subCommittees: {
                Shape: Committee[];
                Name: "Committee";
                Nullable: false;
            };
            messages: {
                Shape: Message[];
                Name: "Message";
                Nullable: false;
            };
            agendaItems: {
                Shape: AgendaItem[];
                Name: "AgendaItem";
                Nullable: false;
            };
        };
    };
    CommitteeMember: {
        Name: "CommitteeMember";
        Shape: CommitteeMember;
        Include: Prisma.CommitteeMemberInclude;
        Select: Prisma.CommitteeMemberSelect;
        OrderBy: Prisma.CommitteeMemberOrderByWithRelationInput;
        WhereUnique: Prisma.CommitteeMemberWhereUniqueInput;
        Where: Prisma.CommitteeMemberWhereInput;
        Create: {};
        Update: {};
        RelationName: "committee" | "user" | "speakerLists" | "delegation";
        ListRelations: "speakerLists";
        Relations: {
            committee: {
                Shape: Committee;
                Name: "Committee";
                Nullable: false;
            };
            user: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            speakerLists: {
                Shape: SpeakerOnList[];
                Name: "SpeakerOnList";
                Nullable: false;
            };
            delegation: {
                Shape: Delegation | null;
                Name: "Delegation";
                Nullable: true;
            };
        };
    };
    AgendaItem: {
        Name: "AgendaItem";
        Shape: AgendaItem;
        Include: Prisma.AgendaItemInclude;
        Select: Prisma.AgendaItemSelect;
        OrderBy: Prisma.AgendaItemOrderByWithRelationInput;
        WhereUnique: Prisma.AgendaItemWhereUniqueInput;
        Where: Prisma.AgendaItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "committee" | "speakerLists";
        ListRelations: "speakerLists";
        Relations: {
            committee: {
                Shape: Committee;
                Name: "Committee";
                Nullable: false;
            };
            speakerLists: {
                Shape: SpeakersList[];
                Name: "SpeakersList";
                Nullable: false;
            };
        };
    };
    SpeakersList: {
        Name: "SpeakersList";
        Shape: SpeakersList;
        Include: Prisma.SpeakersListInclude;
        Select: Prisma.SpeakersListSelect;
        OrderBy: Prisma.SpeakersListOrderByWithRelationInput;
        WhereUnique: Prisma.SpeakersListWhereUniqueInput;
        Where: Prisma.SpeakersListWhereInput;
        Create: {};
        Update: {};
        RelationName: "agendaItem" | "speakers";
        ListRelations: "speakers";
        Relations: {
            agendaItem: {
                Shape: AgendaItem;
                Name: "AgendaItem";
                Nullable: false;
            };
            speakers: {
                Shape: SpeakerOnList[];
                Name: "SpeakerOnList";
                Nullable: false;
            };
        };
    };
    SpeakerOnList: {
        Name: "SpeakerOnList";
        Shape: SpeakerOnList;
        Include: Prisma.SpeakerOnListInclude;
        Select: Prisma.SpeakerOnListSelect;
        OrderBy: Prisma.SpeakerOnListOrderByWithRelationInput;
        WhereUnique: Prisma.SpeakerOnListWhereUniqueInput;
        Where: Prisma.SpeakerOnListWhereInput;
        Create: {};
        Update: {};
        RelationName: "speakersList" | "committeeMember";
        ListRelations: never;
        Relations: {
            speakersList: {
                Shape: SpeakersList;
                Name: "SpeakersList";
                Nullable: false;
            };
            committeeMember: {
                Shape: CommitteeMember;
                Name: "CommitteeMember";
                Nullable: false;
            };
        };
    };
    Delegation: {
        Name: "Delegation";
        Shape: Delegation;
        Include: Prisma.DelegationInclude;
        Select: Prisma.DelegationSelect;
        OrderBy: Prisma.DelegationOrderByWithRelationInput;
        WhereUnique: Prisma.DelegationWhereUniqueInput;
        Where: Prisma.DelegationWhereInput;
        Create: {};
        Update: {};
        RelationName: "conference" | "nation" | "members";
        ListRelations: "members";
        Relations: {
            conference: {
                Shape: Conference;
                Name: "Conference";
                Nullable: false;
            };
            nation: {
                Shape: Nation;
                Name: "Nation";
                Nullable: false;
            };
            members: {
                Shape: CommitteeMember[];
                Name: "CommitteeMember";
                Nullable: false;
            };
        };
    };
    Nation: {
        Name: "Nation";
        Shape: Nation;
        Include: Prisma.NationInclude;
        Select: Prisma.NationSelect;
        OrderBy: Prisma.NationOrderByWithRelationInput;
        WhereUnique: Prisma.NationWhereUniqueInput;
        Where: Prisma.NationWhereInput;
        Create: {};
        Update: {};
        RelationName: "delegations";
        ListRelations: "delegations";
        Relations: {
            delegations: {
                Shape: Delegation[];
                Name: "Delegation";
                Nullable: false;
            };
        };
    };
    Message: {
        Name: "Message";
        Shape: Message;
        Include: Prisma.MessageInclude;
        Select: Prisma.MessageSelect;
        OrderBy: Prisma.MessageOrderByWithRelationInput;
        WhereUnique: Prisma.MessageWhereUniqueInput;
        Where: Prisma.MessageWhereInput;
        Create: {};
        Update: {};
        RelationName: "committee" | "author";
        ListRelations: never;
        Relations: {
            committee: {
                Shape: Committee;
                Name: "Committee";
                Nullable: false;
            };
            author: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
}