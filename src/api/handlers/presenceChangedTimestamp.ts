import { abilityBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isAdminInConference } from '$api/services/authHelper';

abilityBuilder.presenceChangedTimestamp.allow('read').when((ctx) => {
	return {
		where: {
			committeeMember: {
				committee: isAdminInConference(ctx)
			}
		}
	};
});

object({ table: 'presenceChangedTimestamp' });
// const pubsub = rumblePubsub({ table: 'presenceChangedTimestamp' });
query({ table: 'presenceChangedTimestamp' });
