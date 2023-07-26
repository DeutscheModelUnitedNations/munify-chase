import {
  Chair,
  ConferenceAdmin,
  Delegate,
  NonStateActor,
  SecretaryMember,
  Visitor,
} from "../../types/metadata";

import {Set as ImmutableSet} from "immutable";

export const ZITADEL_METADATA_CLAIM = "urn:zitadel:iam:user:metadata";

export interface Metadata {
  nonStateActorPermissions: ImmutableSet<NonStateActor>;
  representativePermissions: ImmutableSet<Delegate>;
  secretaryMemberPermissions: ImmutableSet<SecretaryMember>;
  chairPermissions: ImmutableSet<Chair>;
  conferenceAdminPermissions: ImmutableSet<ConferenceAdmin>;
  visitorPermissions: ImmutableSet<Visitor>;
  pronouns: string;
}

export type MetadataKeys =
  | "nonStateActorPermissions"
  | "representativePermissions"
  | "secretaryMemberPermissions"
  | "chairPermissions"
  | "pronouns"
  | "conferenceAdminPermissions"
  | "visitorPermissions";

export type RawMetadata = {
  [key in MetadataKeys]: string;
};

export function parseMetadata(rawMetadata?: RawMetadata): Metadata {
  return {
    pronouns: rawMetadata?.pronouns ?? "",
    nonStateActorPermissions:
      decodeFromBase64JSON(rawMetadata?.nonStateActorPermissions) ?? [],
    representativePermissions:
      decodeFromBase64JSON(rawMetadata?.representativePermissions) ?? [],
    secretaryMemberPermissions:
      decodeFromBase64JSON(rawMetadata?.secretaryMemberPermissions) ?? [],
    chairPermissions: decodeFromBase64JSON(rawMetadata?.chairPermissions) ?? [],
    conferenceAdminPermissions:
      decodeFromBase64JSON(rawMetadata?.conferenceAdminPermissions) ?? [],
    visitorPermissions:
      decodeFromBase64JSON(rawMetadata?.visitorPermissions) ?? [],
  };
}

export function decodeFromBase64JSON(value?: string) {
  if (!value) return undefined;
  return JSON.parse(Buffer.from(value, "base64").toString("utf-8"));
}
