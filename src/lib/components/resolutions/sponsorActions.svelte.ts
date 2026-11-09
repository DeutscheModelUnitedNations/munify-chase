import toast from 'svelte-french-toast';
import { errorMessage } from '#lib/helpers/errorMessage';

/**
 * Adding and removing sponsors with a shared busy flag; failures become
 * toasts. Papers and amendments pass their own mutations.
 */
export function createSponsorActions({
	addSponsor,
	removeSponsor
}: {
	addSponsor: (committeeMemberId?: string) => Promise<unknown>;
	removeSponsor: (id: string) => Promise<unknown>;
}) {
	let busy = $state(false);
	return {
		get busy() {
			return busy;
		},
		async add(committeeMemberId?: string) {
			busy = true;
			try {
				await addSponsor(committeeMemberId);
			} catch (err) {
				toast.error(errorMessage(err, 'Failed'));
			} finally {
				busy = false;
			}
		},
		async remove(id: string) {
			try {
				await removeSponsor(id);
			} catch (err) {
				toast.error(errorMessage(err, 'Failed'));
			}
		}
	};
}

export type SponsorActions = ReturnType<typeof createSponsorActions>;
