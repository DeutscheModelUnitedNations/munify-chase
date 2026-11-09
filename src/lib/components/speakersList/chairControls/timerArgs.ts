/** `{ phase }` when the controls belong to a list of type `when`, else nothing to spread */
export function phaseFor<const P extends string>({
	type,
	when,
	phase
}: {
	type: string;
	when: string;
	phase: P;
}): { phase?: P } {
	return type === when ? { phase } : {};
}

/**
 * The time the other list's timer is reset to when this one starts: the speakers list
 * gets this list's speaking time, a comment list its own.
 */
export function otherListTimeLeft({
	otherList,
	speakingTime
}: {
	otherList: { type: string; speakingTime: number };
	speakingTime: number;
}): number {
	return otherList.type === 'SPEAKERS_LIST' ? speakingTime : otherList.speakingTime;
}

/** Whether any mutation answered without a result, which is how a failed timer update shows */
export function hasEmptyResult(results: PromiseSettledResult<unknown>[]): boolean {
	return results.some((r) => r.status === 'fulfilled' && !r.value);
}
