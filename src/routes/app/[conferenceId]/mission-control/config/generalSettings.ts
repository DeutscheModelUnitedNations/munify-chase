/** Pure helpers behind the conference's general settings form. */

export type GeneralSettingsForm = {
	title: string;
	pressWebsite: string;
	location: string;
	startDate: string;
	endDate: string;
	hasModeratedCaucus: boolean;
	logoSvg: string;
};

type ConferenceSettings = {
	id: string;
	title: string;
	pressWebsite: string | null;
	location: string | null;
	startDate: Date | null;
	endDate: Date | null;
	hasModeratedCaucus: boolean;
	logoSvg: string | null;
};

/** A date as the value of an `<input type="date">`, in UTC. */
export function toDateInputValue(d: Date | string | null | undefined): string {
	if (!d) return '';
	const date = new Date(d);
	if (Number.isNaN(date.getTime())) return '';
	return date.toISOString().slice(0, 10);
}

export function settingsForm(conference: ConferenceSettings): GeneralSettingsForm {
	return {
		title: conference.title,
		pressWebsite: conference.pressWebsite ?? '',
		location: conference.location ?? '',
		startDate: toDateInputValue(conference.startDate),
		endDate: toDateInputValue(conference.endDate),
		hasModeratedCaucus: conference.hasModeratedCaucus,
		logoSvg: conference.logoSvg ?? ''
	};
}

/** The update's arguments: empty fields clear their column. */
export function settingsUpdate({ id, form }: { id: string; form: GeneralSettingsForm }) {
	return {
		id,
		title: form.title,
		pressWebsite: form.pressWebsite || null,
		location: form.location || null,
		startDate: form.startDate ? new Date(form.startDate) : null,
		endDate: form.endDate ? new Date(form.endDate) : null,
		hasModeratedCaucus: form.hasModeratedCaucus,
		logoSvg: form.logoSvg
	};
}

export const MAX_LOGO_BYTES = 512 * 1024;

/** The SVG markup of an uploaded logo, or null when it is too big, unreadable or no SVG. */
export async function readSvgLogo(file: Pick<File, 'size' | 'text'>): Promise<string | null> {
	if (file.size > MAX_LOGO_BYTES) return null;
	const text = await file.text().catch(() => null);
	return text?.includes('<svg') ? text : null;
}
