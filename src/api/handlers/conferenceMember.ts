import {
  abilityBuilder,
  countQuery,
  object,
  query,
  whereArg,
} from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";

abilityBuilder.conferenceMember.allow("read").when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  if (user?.email && isDMUNEmail(user.email)) {
    return "allow";
  }
});

const ref = object({ table: "conferenceMember" });
query({ table: "conferenceMember" });
countQuery({
  table: "conferenceMember",
});
// const pubsub = rumblePubsub({ table: "conferenceMember" });

export const ConferenceMemberWhereInput = whereArg({
  table: "conferenceMember",
});
export const ConferenceMemberRef = ref;
