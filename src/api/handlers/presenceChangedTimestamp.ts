import { abilityBuilder, object, query } from '$api/rumble';
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
query({ table: 'presenceChangedTimestamp' });
