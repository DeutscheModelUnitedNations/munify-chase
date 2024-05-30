import * as User from "./User";
import * as ConferenceCreationToken from "./ConferenceCreationToken";
import * as Conference from "./Conference";
import * as ConferenceMember from "./ConferenceMember";
import * as Committee from "./Committee";
import * as CommitteeMember from "./CommitteeMember";
import * as AgendaItem from "./AgendaItem";
import * as SpeakersList from "./SpeakersList";
import * as SpeakerOnList from "./SpeakerOnList";
import * as Delegation from "./Delegation";
import * as Nation from "./Nation";
import * as Message from "./Message";
import { builder } from "../../../src/resolvers/builder";
import type * as Objects from "./objects";

type Model = Objects.Model;

export const Cruds: Record<
  Objects.Model,
  {
    Object: any;
    queries: Record<string, Function>;
    mutations: Record<string, Function>;
  }
> = {
  User: {
    Object: User.UserObject,
    queries: {
      findFirst: User.findFirstUserQueryObject,
      findMany: User.findManyUserQueryObject,
      count: User.countUserQueryObject,
      findUnique: User.findUniqueUserQueryObject,
    },
    mutations: {
      createMany: User.createManyUserMutationObject,
      createOne: User.createOneUserMutationObject,
      deleteMany: User.deleteManyUserMutationObject,
      deleteOne: User.deleteOneUserMutationObject,
      updateMany: User.updateManyUserMutationObject,
      updateOne: User.updateOneUserMutationObject,
      upsertOne: User.upsertOneUserMutationObject,
    },
  },
  ConferenceCreationToken: {
    Object: ConferenceCreationToken.ConferenceCreationTokenObject,
    queries: {
      findFirst:
        ConferenceCreationToken.findFirstConferenceCreationTokenQueryObject,
      findMany:
        ConferenceCreationToken.findManyConferenceCreationTokenQueryObject,
      count: ConferenceCreationToken.countConferenceCreationTokenQueryObject,
      findUnique:
        ConferenceCreationToken.findUniqueConferenceCreationTokenQueryObject,
    },
    mutations: {
      createMany:
        ConferenceCreationToken.createManyConferenceCreationTokenMutationObject,
      createOne:
        ConferenceCreationToken.createOneConferenceCreationTokenMutationObject,
      deleteMany:
        ConferenceCreationToken.deleteManyConferenceCreationTokenMutationObject,
      deleteOne:
        ConferenceCreationToken.deleteOneConferenceCreationTokenMutationObject,
      updateMany:
        ConferenceCreationToken.updateManyConferenceCreationTokenMutationObject,
      updateOne:
        ConferenceCreationToken.updateOneConferenceCreationTokenMutationObject,
      upsertOne:
        ConferenceCreationToken.upsertOneConferenceCreationTokenMutationObject,
    },
  },
  Conference: {
    Object: Conference.ConferenceObject,
    queries: {
      findFirst: Conference.findFirstConferenceQueryObject,
      findMany: Conference.findManyConferenceQueryObject,
      count: Conference.countConferenceQueryObject,
      findUnique: Conference.findUniqueConferenceQueryObject,
    },
    mutations: {
      createMany: Conference.createManyConferenceMutationObject,
      createOne: Conference.createOneConferenceMutationObject,
      deleteMany: Conference.deleteManyConferenceMutationObject,
      deleteOne: Conference.deleteOneConferenceMutationObject,
      updateMany: Conference.updateManyConferenceMutationObject,
      updateOne: Conference.updateOneConferenceMutationObject,
      upsertOne: Conference.upsertOneConferenceMutationObject,
    },
  },
  ConferenceMember: {
    Object: ConferenceMember.ConferenceMemberObject,
    queries: {
      findFirst: ConferenceMember.findFirstConferenceMemberQueryObject,
      findMany: ConferenceMember.findManyConferenceMemberQueryObject,
      count: ConferenceMember.countConferenceMemberQueryObject,
      findUnique: ConferenceMember.findUniqueConferenceMemberQueryObject,
    },
    mutations: {
      createMany: ConferenceMember.createManyConferenceMemberMutationObject,
      createOne: ConferenceMember.createOneConferenceMemberMutationObject,
      deleteMany: ConferenceMember.deleteManyConferenceMemberMutationObject,
      deleteOne: ConferenceMember.deleteOneConferenceMemberMutationObject,
      updateMany: ConferenceMember.updateManyConferenceMemberMutationObject,
      updateOne: ConferenceMember.updateOneConferenceMemberMutationObject,
      upsertOne: ConferenceMember.upsertOneConferenceMemberMutationObject,
    },
  },
  Committee: {
    Object: Committee.CommitteeObject,
    queries: {
      findFirst: Committee.findFirstCommitteeQueryObject,
      findMany: Committee.findManyCommitteeQueryObject,
      count: Committee.countCommitteeQueryObject,
      findUnique: Committee.findUniqueCommitteeQueryObject,
    },
    mutations: {
      createMany: Committee.createManyCommitteeMutationObject,
      createOne: Committee.createOneCommitteeMutationObject,
      deleteMany: Committee.deleteManyCommitteeMutationObject,
      deleteOne: Committee.deleteOneCommitteeMutationObject,
      updateMany: Committee.updateManyCommitteeMutationObject,
      updateOne: Committee.updateOneCommitteeMutationObject,
      upsertOne: Committee.upsertOneCommitteeMutationObject,
    },
  },
  CommitteeMember: {
    Object: CommitteeMember.CommitteeMemberObject,
    queries: {
      findFirst: CommitteeMember.findFirstCommitteeMemberQueryObject,
      findMany: CommitteeMember.findManyCommitteeMemberQueryObject,
      count: CommitteeMember.countCommitteeMemberQueryObject,
      findUnique: CommitteeMember.findUniqueCommitteeMemberQueryObject,
    },
    mutations: {
      createMany: CommitteeMember.createManyCommitteeMemberMutationObject,
      createOne: CommitteeMember.createOneCommitteeMemberMutationObject,
      deleteMany: CommitteeMember.deleteManyCommitteeMemberMutationObject,
      deleteOne: CommitteeMember.deleteOneCommitteeMemberMutationObject,
      updateMany: CommitteeMember.updateManyCommitteeMemberMutationObject,
      updateOne: CommitteeMember.updateOneCommitteeMemberMutationObject,
      upsertOne: CommitteeMember.upsertOneCommitteeMemberMutationObject,
    },
  },
  AgendaItem: {
    Object: AgendaItem.AgendaItemObject,
    queries: {
      findFirst: AgendaItem.findFirstAgendaItemQueryObject,
      findMany: AgendaItem.findManyAgendaItemQueryObject,
      count: AgendaItem.countAgendaItemQueryObject,
      findUnique: AgendaItem.findUniqueAgendaItemQueryObject,
    },
    mutations: {
      createMany: AgendaItem.createManyAgendaItemMutationObject,
      createOne: AgendaItem.createOneAgendaItemMutationObject,
      deleteMany: AgendaItem.deleteManyAgendaItemMutationObject,
      deleteOne: AgendaItem.deleteOneAgendaItemMutationObject,
      updateMany: AgendaItem.updateManyAgendaItemMutationObject,
      updateOne: AgendaItem.updateOneAgendaItemMutationObject,
      upsertOne: AgendaItem.upsertOneAgendaItemMutationObject,
    },
  },
  SpeakersList: {
    Object: SpeakersList.SpeakersListObject,
    queries: {
      findFirst: SpeakersList.findFirstSpeakersListQueryObject,
      findMany: SpeakersList.findManySpeakersListQueryObject,
      count: SpeakersList.countSpeakersListQueryObject,
      findUnique: SpeakersList.findUniqueSpeakersListQueryObject,
    },
    mutations: {
      createMany: SpeakersList.createManySpeakersListMutationObject,
      createOne: SpeakersList.createOneSpeakersListMutationObject,
      deleteMany: SpeakersList.deleteManySpeakersListMutationObject,
      deleteOne: SpeakersList.deleteOneSpeakersListMutationObject,
      updateMany: SpeakersList.updateManySpeakersListMutationObject,
      updateOne: SpeakersList.updateOneSpeakersListMutationObject,
      upsertOne: SpeakersList.upsertOneSpeakersListMutationObject,
    },
  },
  SpeakerOnList: {
    Object: SpeakerOnList.SpeakerOnListObject,
    queries: {
      findFirst: SpeakerOnList.findFirstSpeakerOnListQueryObject,
      findMany: SpeakerOnList.findManySpeakerOnListQueryObject,
      count: SpeakerOnList.countSpeakerOnListQueryObject,
      findUnique: SpeakerOnList.findUniqueSpeakerOnListQueryObject,
    },
    mutations: {
      createMany: SpeakerOnList.createManySpeakerOnListMutationObject,
      createOne: SpeakerOnList.createOneSpeakerOnListMutationObject,
      deleteMany: SpeakerOnList.deleteManySpeakerOnListMutationObject,
      deleteOne: SpeakerOnList.deleteOneSpeakerOnListMutationObject,
      updateMany: SpeakerOnList.updateManySpeakerOnListMutationObject,
      updateOne: SpeakerOnList.updateOneSpeakerOnListMutationObject,
      upsertOne: SpeakerOnList.upsertOneSpeakerOnListMutationObject,
    },
  },
  Delegation: {
    Object: Delegation.DelegationObject,
    queries: {
      findFirst: Delegation.findFirstDelegationQueryObject,
      findMany: Delegation.findManyDelegationQueryObject,
      count: Delegation.countDelegationQueryObject,
      findUnique: Delegation.findUniqueDelegationQueryObject,
    },
    mutations: {
      createMany: Delegation.createManyDelegationMutationObject,
      createOne: Delegation.createOneDelegationMutationObject,
      deleteMany: Delegation.deleteManyDelegationMutationObject,
      deleteOne: Delegation.deleteOneDelegationMutationObject,
      updateMany: Delegation.updateManyDelegationMutationObject,
      updateOne: Delegation.updateOneDelegationMutationObject,
      upsertOne: Delegation.upsertOneDelegationMutationObject,
    },
  },
  Nation: {
    Object: Nation.NationObject,
    queries: {
      findFirst: Nation.findFirstNationQueryObject,
      findMany: Nation.findManyNationQueryObject,
      count: Nation.countNationQueryObject,
      findUnique: Nation.findUniqueNationQueryObject,
    },
    mutations: {
      createMany: Nation.createManyNationMutationObject,
      createOne: Nation.createOneNationMutationObject,
      deleteMany: Nation.deleteManyNationMutationObject,
      deleteOne: Nation.deleteOneNationMutationObject,
      updateMany: Nation.updateManyNationMutationObject,
      updateOne: Nation.updateOneNationMutationObject,
      upsertOne: Nation.upsertOneNationMutationObject,
    },
  },
  Message: {
    Object: Message.MessageObject,
    queries: {
      findFirst: Message.findFirstMessageQueryObject,
      findMany: Message.findManyMessageQueryObject,
      count: Message.countMessageQueryObject,
      findUnique: Message.findUniqueMessageQueryObject,
    },
    mutations: {
      createMany: Message.createManyMessageMutationObject,
      createOne: Message.createOneMessageMutationObject,
      deleteMany: Message.deleteManyMessageMutationObject,
      deleteOne: Message.deleteOneMessageMutationObject,
      updateMany: Message.updateManyMessageMutationObject,
      updateOne: Message.updateOneMessageMutationObject,
      upsertOne: Message.upsertOneMessageMutationObject,
    },
  },
};

const crudEntries = Object.entries(Cruds);

type ResolverType = "Query" | "Mutation";
function generateResolversByType(type: ResolverType, opts?: CrudOptions) {
  return crudEntries
    .filter(([modelName]) => includeModel(modelName, opts))
    .map(([modelName, config]) => {
      const resolverEntries = Object.entries(
        config[type === "Query" ? "queries" : "mutations"],
      );

      return resolverEntries.map(([operationName, resolverObjectDefiner]) => {
        const resolverName = operationName + modelName;
        const isntPrismaFieldList = ["count", "deleteMany", "updateMany"];
        const isPrismaField = !isntPrismaFieldList.includes(operationName);

        const getFields = (t: any) => {
          const field = resolverObjectDefiner(t);
          const handledField = opts?.handleResolver
            ? opts.handleResolver({
                field,
                modelName: modelName as Model,
                operationName,
                resolverName,
                t,
                isPrismaField,
                type,
              })
            : field;

          return {
            [resolverName]: isPrismaField
              ? t.prismaField(handledField)
              : t.field(handledField),
          };
        };

        return type === "Query"
          ? builder.queryFields((t) => getFields(t))
          : builder.mutationFields((t) => getFields(t));
      });
    });
}

export function generateAllObjects(opts?: CrudOptions) {
  return crudEntries
    .filter(([md]) => includeModel(md, opts))
    .map(([modelName, { Object }]) => {
      return builder.prismaObject(modelName as Model, Object); // Objects is all imports
    });
}

export function generateAllQueries(opts?: CrudOptions) {
  generateResolversByType("Query", opts);
}

export function generateAllMutations(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
}

export function generateAllResolvers(opts?: CrudOptions) {
  generateResolversByType("Mutation", opts);
  generateResolversByType("Query", opts);
}

type CrudOptions = {
  include?: Model[];
  exclude?: Model[];
  /**
   * Caution: This is not type safe
   * Wrap all queries/mutations to override args, run extra code in resolve function (ie: throw errors, logs), apply plugins, etc.
   */
  handleResolver?: (props: {
    modelName: Model;
    field: any;
    operationName: string;
    resolverName: string;
    t: any;
    isPrismaField: boolean;
    type: ResolverType;
  }) => any;
};

const includeModel = (model: string, opts?: CrudOptions): boolean => {
  if (!opts) return true;
  if (opts.include) return opts.include.includes(model as Model);
  if (opts.exclude) return !opts.exclude.includes(model as Model);
  return true;
};

export function generateAllCrud(opts?: CrudOptions) {
  generateAllObjects(opts);
  generateAllQueries(opts);
  generateAllMutations(opts);
}
