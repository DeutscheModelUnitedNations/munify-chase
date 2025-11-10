import { abilityBuilder, countQuery, object, query } from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";

abilityBuilder.representation
  .allow(["read", "update"])
  .when(({ mustBeLoggedIn }) => {
    const user = mustBeLoggedIn();
    if (user?.email && isDMUNEmail(user.email)) {
      return "allow";
    }
  });

const _ref = object({ table: "representation" });
// const pubsub = rumblePubsub({ table: "representation" });
query({ table: "representation" });
countQuery({
  table: "representation",
});
