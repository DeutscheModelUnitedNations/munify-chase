import { abilityBuilder, countQuery, object, query } from '$api/rumble';

abilityBuilder.conferenceUser.allow('read').when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();

  return {
    where: {
      user: {
        id: user.sub
      }
    }
  };
});

const _ref = object({ table: 'conferenceUser' });
// const pubsub = rumblePubsub({ table: "conferenceUser" });
query({ table: 'conferenceUser' });
countQuery({
  table: 'conferenceUser'
});
