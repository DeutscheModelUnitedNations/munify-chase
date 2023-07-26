import {ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN} from "./editUserMetadata";
import {Metadata, MetadataKeys, decodeFromBase64JSON} from "./parseMetadata";

export async function fetchMetadataKey(userId: number, key: MetadataKeys) {
    const res = await fetch(
        `${process.env.OPENID_URL}/management/v1/users/${userId}/metadata/${key}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN}`,
            },
        },
    );

    if (!res.status.toString().startsWith("2")) {
        throw new Error(`Failed to fetch user metadata: ${await res.text()}`);
    }

    return decodeFromBase64JSON((await res.json()).value);
}

//TODO https://github.com/zitadel/zitadel/discussions/6257
export async function fetchMetadataBulk(userId: number) {
    const metadataKeysObject: {[key in MetadataKeys]: null} = {
        nonStateActorPermissions: null,
        representativePermissions: null,
        secretaryMemberPermissions: null,
        chairPermissions: null,
        pronouns: null,
        conferenceAdminPermissions: null,
        visitorPermissions: null,
    };

    const amount = Object.keys(metadataKeysObject).length;

    const res = await fetch(
        `${process.env.OPENID_URL}/management/v1/users/${userId}/metadata/_search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${ZITADEL_SERVICE_USER_PERSONAL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                query: {
                    limit: amount,
                }
            }),
        },
    );

    if (!res.status.toString().startsWith("2")) {
        throw new Error(`Failed to fetch user metadata: ${await res.text()}`);
    }

    const parsedRes = await res.json();

    if (parsedRes.details.totalResult !== amount) {
        throw new Error("Metadata request returned unexpected amount of results");
    }

    // rome-ignore lint/suspicious/noExplicitAny: we trust the output format of the metadata
    const ret: any = {};
    const result: {key: string, value: string}[] = parsedRes.result;
    result.forEach(({key, value}) => {
        ret[key] = decodeFromBase64JSON(value);
    })

    return ret;
}
