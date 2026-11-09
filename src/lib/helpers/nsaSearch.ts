/** Lower case without diacritics, so "Müller" is found as "muller" and "MÜLLER". */
function folded(text: string) {
	return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * The NSAs whose name, e-mail or organisation contains every word of the query, for checking
 * someone in by name when their code does not scan.
 */
export function searchNsas<
	T extends { name: string | null; userEmail: string; nsaName: string | null }
>({ nsas, query, limit = 8 }: { nsas: readonly T[]; query: string; limit?: number }): T[] {
	const words = folded(query).split(/\s+/).filter(Boolean);
	if (words.length === 0) return [];
	return nsas
		.filter((nsa) => {
			const haystack = folded([nsa.name ?? '', nsa.userEmail, nsa.nsaName ?? ''].join(' '));
			return words.every((word) => haystack.includes(word));
		})
		.slice(0, limit);
}

/** A conference user as the NSA scanner and its name search use it. */
export function nsaOfUser(user: {
	id: string;
	name?: string | null;
	userEmail: string;
	delegatorUserId?: string | null;
	cardNumber: number;
	conferenceMember?: { representation?: { name?: string | null } | null } | null;
}) {
	return {
		id: user.id,
		name: user.name ?? null,
		userEmail: user.userEmail,
		delegatorUserId: user.delegatorUserId ?? null,
		cardNumber: user.cardNumber,
		nsaName: user.conferenceMember?.representation?.name ?? null
	};
}
