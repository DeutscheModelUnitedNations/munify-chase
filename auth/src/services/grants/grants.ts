import {Commitee, Conference, UserMetadata} from "../../types/metadata";
import {setUserMetadata} from "../../services/zitadel/editUserMetadata";

export class Grants {
    constructor(private readonly userId: string, private readonly metadata: UserMetadata) { }

    setConferenceAdmin(conference: Conference) {
        this.metadata.conferenceAdminGrants.push({
            conference
        });

        return setUserMetadata(this.userId, {
            conferenceAdminGrants: this.metadata.conferenceAdminGrants
        });
    }

    revokeConferenceAdmin(conference: Conference) {
        this.metadata.conferenceAdminGrants = this.metadata.conferenceAdminGrants.filter(c => c.conference !== conference);

        return setUserMetadata(this.userId, {
            conferenceAdminGrants: this.metadata.conferenceAdminGrants
        });
    }

    canReadCommitee(commitee: Commitee): boolean {
        return (
            this.metadata.visitorGrants.some(
                (v) => v.conference === commitee.conference,
            ) ||
            this.metadata.secretaryMemberGrants.some(
                (v) => v.conference === commitee.conference,
            ) ||
            this.metadata.conferenceAdminGrants.some(
                (v) => v.conference === commitee.conference,
            ) ||
            this.metadata.nonStateActorGrants.some(
                (v) => v.conference === commitee.conference,
            ) ||
            this.metadata.chairGrants.some(
                (v) => v.commitee.conference === commitee.conference, // even though chairs are assigned to commitees, its nice for them to be able to read other commitees
            ) ||
            this.metadata.representativeGrants.some(
                (v) => v.commitee.id === commitee.id, // these are the only folks who are not allowed to read other commitees except their own
            )
        );
    }

    canManageCommitee(commitee: Commitee): boolean {
        return (
            this.metadata.conferenceAdminGrants.some(
                (v) => v.conference === commitee.conference,
            ) ||
            this.metadata.chairGrants.some(
                (v) => v.commitee.id === commitee.id,
            )
        );
    }
}
