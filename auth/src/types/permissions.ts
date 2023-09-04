import { Commitee, ConferenceId } from "./metadata";
import { Metadata } from "../services/zitadel/parseMetadata";
import { type MetadataSetter } from "../services/zitadel/editUserMetadata";

/**
 * This class is a wrapper around the user metadata and abstracts the actual business logic for the permissions in the system.
 * It maps the question "Can a user do, edit, see XY" to a function which checks the claims in the metadata
 * Also it provides helpers to update user permissions
 */
export class Permissions {
  constructor(
    private readonly userId: string,
    private readonly metadata: Metadata,
    private readonly metadataSetter: MetadataSetter, // make this exchangeable for dev mocking
  ) {}

  setConferenceAdmin(conference: ConferenceId) {
    this.metadata.conferenceAdminPermissions.push({
      conference,
    });

    return this.metadataSetter(this.userId, {
      conferenceAdminPermissions: this.metadata.conferenceAdminPermissions,
    });
  }

  revokeConferenceAdmin(conference: ConferenceId) {
    this.metadata.conferenceAdminPermissions =
      this.metadata.conferenceAdminPermissions.filter(
        (c) => c.conference !== conference,
      );

    return this.metadataSetter(this.userId, {
      conferenceAdminPermissions: this.metadata.conferenceAdminPermissions,
    });
  }

  canReadCommitee(commitee: Commitee): boolean {
    return (
      this.metadata.visitorPermissions.some(
        (v) => v.conference === commitee.conference,
      ) ||
      this.metadata.secretaryMemberPermissions.some(
        (v) => v.conference === commitee.conference,
      ) ||
      this.metadata.conferenceAdminPermissions.some(
        (v) => v.conference === commitee.conference,
      ) ||
      this.metadata.nonStateActorPermissions.some(
        (v) => v.conference === commitee.conference,
      ) ||
      this.metadata.chairPermissions.some(
        (v) => v.commitee.conference === commitee.conference, // even though chairs are assigned to commitees, its nice for them to be able to read other commitees
      ) ||
      this.metadata.representativePermissions.some(
        (v) => v.commitee.id === commitee.id, // these are the only folks who are not allowed to read other commitees except their own
      )
    );
  }

  canManageCommitee(commitee: Commitee): boolean {
    return (
      this.metadata.conferenceAdminPermissions.some(
        (v) => v.conference === commitee.conference,
      ) ||
      this.metadata.chairPermissions.some((v) => v.commitee.id === commitee.id)
    );
  }
}
