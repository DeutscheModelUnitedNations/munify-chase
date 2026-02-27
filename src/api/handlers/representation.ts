import { abilityBuilder, countQuery, object, query } from '$api/rumble';

abilityBuilder.representation.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
  mustBeLoggedIn();
  return 'allow';
});

const _ref = object({ table: 'representation' });
// const pubsub = rumblePubsub({ table: "representation" });
query({ table: 'representation' });
countQuery({
  table: 'representation'
});
