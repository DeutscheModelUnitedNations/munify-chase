import { abilityBuilder, countQuery, object, query } from '$api/rumble';

abilityBuilder.user.allow('read').when(({ mustBeLoggedIn }) => {
  mustBeLoggedIn();
  return 'allow';
});

const _ref = object({ table: 'user' });
query({ table: 'user' });
countQuery({
  table: 'user'
});
// const pubsub = rumblePubsub({ table: "user" });
