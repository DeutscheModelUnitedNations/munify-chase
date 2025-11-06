import { abilityBuilder } from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";
import { basics } from "./basics";

const { arg, ref, pubsub, table } = basics("conferenceMember");

abilityBuilder.conferenceMember.allow("read").when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  if (user?.email && isDMUNEmail(user.email)) {
    return "allow";
  }
});

export const ConferenceMemberWhereInput = arg;
export const ConferenceMemberRef = ref;
