import { abilityBuilder, countQuery, object, query, whereArg } from '$api/rumble';

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
  const user = mustBeLoggedIn();
  return {
    where: {
      conference: {
        users: {
          user: {
            id: user.sub
          }
        }
      }
    }
  };
});

const ref = object({ table: 'conferenceMember' });
query({ table: 'conferenceMember' });
countQuery({
  table: 'conferenceMember'
});
// const pubsub = rumblePubsub({ table: "conferenceMember" });

export const ConferenceMemberWhereInput = whereArg({
  table: 'conferenceMember'
});
export const ConferenceMemberRef = ref;
