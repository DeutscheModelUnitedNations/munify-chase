import {Commitee, ConferenceId} from "./metadata";
import {setUserMetadata} from "../services/zitadel/editUserMetadata";
import {Metadata} from "../services/zitadel/parseMetadata";
import {fetchMetadataBulk} from "../services/zitadel/fetchMetadata";

//TODO periodically clean up unused ids from the metadata

/**
 * This class is a wrapper around the user metadata and abstracts the actual business logic for the permissions in the system.
 * It maps the question "Can a user do, edit, see XY" to a function which checks the claims in the metadata
 * Also it provides helpers to update user permissions
 */
export class Permissions {
  constructor(
    private readonly userId: number,
    private readonly metadata: Metadata,
  ) { }

  /**
   * Creates a permissions class for a user which we do not have an introspection result of. Used for editing/checking permissions
   * of users other than the one calling the handler
   * @param userId The foreign user id
   * @returns a permissions instance
   */
  static async forForeignUser(userId: number) {
    return new Permissions(userId, await fetchMetadataBulk(userId));
  }

  grantConferenceAdmin(conference: ConferenceId) {
    this.metadata.conferenceAdminPermissions.add({
      conference,
    });

    return setUserMetadata(this.userId, {
      conferenceAdminPermissions: this.metadata.conferenceAdminPermissions,
    });
  }

  revokeConferenceAdmin(conference: ConferenceId) {
    this.metadata.conferenceAdminPermissions =
      this.metadata.conferenceAdminPermissions.filter(
        (c) => c.conference !== conference,
      );

    return setUserMetadata(this.userId, {
      conferenceAdminPermissions: this.metadata.conferenceAdminPermissions,
    });
  }

  isConferenceAdmin(conference: ConferenceId): boolean {
    return this.metadata.conferenceAdminPermissions.some(
      (v) => v.conference === conference,
    );
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
