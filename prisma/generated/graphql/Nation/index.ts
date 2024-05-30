export {
  NationObject,
  NationIdFieldObject,
  NationAlpha3CodeFieldObject,
  NationVariantFieldObject,
  NationDelegationsFieldObject,
} from "./object.base";
export {
  createManyNationMutation,
  createOneNationMutation,
  deleteManyNationMutation,
  deleteOneNationMutation,
  updateManyNationMutation,
  updateOneNationMutation,
  upsertOneNationMutation,
  createManyNationMutationObject,
  createOneNationMutationObject,
  deleteManyNationMutationObject,
  deleteOneNationMutationObject,
  updateManyNationMutationObject,
  updateOneNationMutationObject,
  upsertOneNationMutationObject,
} from "./mutations";
export {
  findFirstNationQuery,
  findManyNationQuery,
  countNationQuery,
  findUniqueNationQuery,
  findFirstNationQueryObject,
  findManyNationQueryObject,
  countNationQueryObject,
  findUniqueNationQueryObject,
} from "./queries";
