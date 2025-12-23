import { abilityBuilder, countQuery, object, query } from "$api/rumble";

// abilityBuilder.conferenceUser.allow("read").when(({ mustBeLoggedIn }) => {
//   const user = mustBeLoggedIn();
//   if (user?.email && isDMUNEmail(user.email)) {
//     return "allow";
//   }
// });

const _ref = object({ table: "conferenceUser" });
// const pubsub = rumblePubsub({ table: "conferenceUser" });
query({ table: "conferenceUser" });
countQuery({
  table: "conferenceUser",
});
