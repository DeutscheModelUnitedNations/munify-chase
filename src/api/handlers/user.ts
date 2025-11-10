import { abilityBuilder, countQuery, object, query } from "$api/rumble";
import { isDMUNEmail } from "$api/services/isDMUNEmail";

abilityBuilder.user.allow("read").when(({ oidc }) => {
  if (oidc?.user) {
    return {
      where: { id: oidc.user.sub },
    };
  }
});

abilityBuilder.user.allow("read").when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  if (user?.email && isDMUNEmail(user.email)) {
    return "allow";
  }
});

const _ref = object({ table: "user" });
query({ table: "user" });
countQuery({
  table: "user",
});
// const pubsub = rumblePubsub({ table: "user" });
