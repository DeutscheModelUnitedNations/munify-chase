/**
 * The presence events a change of seats' presence records: one per seat a conference user holds,
 * marked as part of the roll call when it happened during one.
 */
export function presenceEventsFor({
	updated,
	conferenceUsers,
	rollCallSessionId,
	present,
	now
}: {
	updated: { id: string; committeeId: string }[];
	conferenceUsers: { id: string; committeeMemberId: string | null }[];
	rollCallSessionId: string | null | undefined;
	present: boolean;
	now: Date;
}) {
	const userBySeat = new Map(conferenceUsers.map((cu) => [cu.committeeMemberId, cu.id]));
	return updated.flatMap((seat) => {
		const conferenceUserId = userBySeat.get(seat.id);
		if (!conferenceUserId) return [];
		return [
			{
				conferenceUserId,
				committeeId: seat.committeeId,
				rollCallSessionId: rollCallSessionId ?? null,
				type: rollCallSessionId ? ('ROLL_CALL' as const) : ('MANUAL' as const),
				present,
				timestamp: now
			}
		];
	});
}
