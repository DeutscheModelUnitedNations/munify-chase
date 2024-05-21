import {
  CommitteeMemberIdFieldObject,
  CommitteeMemberPresenceFieldObject,
  createOneCommitteeMemberMutationObject,
  deleteOneCommitteeMemberMutationObject,
  findFirstCommitteeMemberQueryObject,
  findManyCommitteeMemberQueryObject,
  findUniqueCommitteeMemberQueryObject,
  updateOneCommitteeMemberMutationObject,
} from "../../prisma/generated/graphql/CommitteeMember";
import { builder } from "./builder";

builder.prismaObject("CommitteeMember", {
  fields: (t) => ({
    id: t.field(CommitteeMemberIdFieldObject),
    presence: t.field(CommitteeMemberPresenceFieldObject),
    delegation: t.relation("delegation", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("read").Delegation,
      }),
    }),
    committee: t.relation("committee"),
    user: t.relation("user", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("read").User,
      }),
    }),
    speakerLists: t.relation("speakerLists", {
      query: (_args, ctx) => ({
        where: ctx.permissions.allowDatabaseAccessTo("list").SpeakerOnList,
      }),
    }),
  }),
});

builder.queryFields((t) => {
  const field = findManyCommitteeMemberQueryObject(t);
  return {
    findManyCommitteeMembers: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").CommitteeMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findFirstCommitteeMemberQueryObject(t);
  return {
    findFirstCommitteeMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").CommitteeMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.queryFields((t) => {
  const field = findUniqueCommitteeMemberQueryObject(t);
  return {
    findUniqueCommitteeMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("read").CommitteeMember],
        };

        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = createOneCommitteeMemberMutationObject(t);
  return {
    createOneCommitteeMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        ctx.permissions.checkIf((user) => user.can("create", "CommitteeMember"));
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = updateOneCommitteeMemberMutationObject(t);
  return {
    updateOneCommitteeMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("update").CommitteeMember],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});

builder.mutationFields((t) => {
  const field = deleteOneCommitteeMemberMutationObject(t);
  return {
    deleteOneCommitteeMember: t.prismaField({
      ...field,
      resolve: (query, root, args, ctx, info) => {
        args.where = {
          ...args.where,
          AND: [ctx.permissions.allowDatabaseAccessTo("delete").CommitteeMember],
        };
        return field.resolve(query, root, args, ctx, info);
      },
    }),
  };
});