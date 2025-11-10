import { abilityBuilder, countQuery, object, query } from "$api/rumble";

abilityBuilder.presenceChangedTimestamp.allow(["read"]).when(({ hasRole }) => {
  if (hasRole("admin")) {
    return "allow";
  }
});

const _ref = object({ table: "presenceChangedTimestamp" });
// const pubsub = rumblePubsub({ table: "presenceChangedTimestamp" });
query({ table: "presenceChangedTimestamp" });
countQuery({
  table: "presenceChangedTimestamp",
});
