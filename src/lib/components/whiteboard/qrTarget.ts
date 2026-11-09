/** The participant page of a committee (or its papers), or undefined while anything is missing */
export function committeeUrl({
	origin,
	conferenceId,
	committeeId,
	includePapers
}: {
	origin: string;
	conferenceId: string | undefined;
	committeeId: string | undefined;
	includePapers: boolean;
}): string | undefined {
	if (!conferenceId || !committeeId || !origin) return undefined;
	const base = `${origin}/app/${encodeURIComponent(conferenceId)}/participant/${encodeURIComponent(committeeId)}`;
	return includePapers ? `${base}/papers` : base;
}

/** Whether a `<dialog>` has to open or close to follow `showModal`, or neither */
export function dialogChange({
	showModal,
	isOpen
}: {
	showModal: boolean;
	isOpen: boolean;
}): 'open' | 'close' | null {
	if (showModal === isOpen) return null;
	return showModal ? 'open' : 'close';
}
