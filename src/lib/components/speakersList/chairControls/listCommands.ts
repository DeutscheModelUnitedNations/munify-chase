import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
import { m } from '$lib/paraglide/messages';

/**
 * The chair controls exist once per list (main list and Point of Information), so their
 * commands need distinct ids and show which list they act on.
 */
export function listCommandScope(type: SpeakerslistcategoryEnum) {
	const isCommentList = type === 'COMMENT_LIST';
	return {
		idPrefix: isCommentList ? 'speakers-list.comment-list' : 'speakers-list.speakers-list',
		context: isCommentList ? m.commentList : m.speakersList,
		keywords: isCommentList ? ['POI'] : []
	};
}
