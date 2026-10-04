export type TourStep = {
	/**
	 * Matches a `data-tour="..."` attribute in the markup. Steps without an anchor
	 * render as a centered popover. The anchor check test fails when an anchor used
	 * here no longer exists in any component.
	 */
	anchor?: string;
	title: () => string;
	body: () => string;
	side?: 'top' | 'right' | 'bottom' | 'left';
};

export type Tour = {
	id: string;
	steps: TourStep[];
};
