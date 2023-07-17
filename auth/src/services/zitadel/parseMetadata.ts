import {MetadataKeys, UserMetadata} from "../../types/metadata";

type Metadata = {
    [key in MetadataKeys]: string
}

export function parseMetadata(metadata?: Metadata): UserMetadata {
    // rome-ignore lint/style/noParameterAssign:
    if (!metadata) metadata = {} as unknown as Metadata;

    return {
        pronouns: metadata["pronouns"] ?? "",
        nonStateActorGrants: decodeFromBase64JSON(metadata["nonStateActorGrants"]) ?? [],
        representativeGrants: decodeFromBase64JSON(metadata["representativeGrants"]) ?? [],
        secretaryMemberGrants: decodeFromBase64JSON(metadata["secretaryMemberGrants"]) ?? [],
        chairGrants: decodeFromBase64JSON(metadata["chairGrants"]) ?? [],
        conferenceAdminGrants: decodeFromBase64JSON(metadata["conferenceAdminGrants"]) ?? [],
        visitorGrants: decodeFromBase64JSON(metadata["visitorGrants"]) ?? [],
    }
}

function decodeFromBase64JSON(value?: string) {
    if (!value) return undefined;
    return JSON.parse(Buffer.from(value, "base64").toString("utf-8"));
}