import type { ComponentProps } from 'svelte';
import { GridItem } from 'svelte-grid-extended';

type PresentationLayoutPresets = {
	committeeTitle?: ComponentProps<GridItem>;
	committeeStatus?: ComponentProps<GridItem>;
	agendaItem?: ComponentProps<GridItem>;
	majorities?: ComponentProps<GridItem>;
	whiteboard?: ComponentProps<GridItem>;
	speakersList?: ComponentProps<GridItem>;
	commentsList?: ComponentProps<GridItem>;
	resolutionPreview?: ComponentProps<GridItem>;
	requests?: ComponentProps<GridItem>;
};

const commonCommitteeTitleProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 1,
		h: 2
	}
};

const commonCommitteeStatusProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 3,
		h: 2
	}
};

const commonCommitteeAgendaItemProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 2,
		h: 2
	}
};

const commonMajoritiesProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 2
	}
};

const commonWhiteboardProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 4
	}
};

const commonSpeakersListProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 4
	}
};

const commonCommentsListProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 4
	}
};

const commonResolutionPreviewProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 4
	}
};

const commonRequestsProps: Partial<ComponentProps<GridItem>> = {
	min: {
		w: 4,
		h: 3
	}
};

export type PresentationLayoutPresetOptions = 'default' | 'smallScreen' | 'resolution';

const presentationLayoutPresets: Record<
	PresentationLayoutPresetOptions,
	PresentationLayoutPresets
> = {
	resolution: {
		committeeStatus: {
			x: 0,
			y: 0,
			w: 4,
			h: 2,
			...commonCommitteeStatusProps
		},
		agendaItem: {
			x: 4,
			y: 0,
			w: 4,
			h: 2,
			...commonCommitteeAgendaItemProps
		},
		majorities: {
			x: 8,
			y: 0,
			w: 4,
			h: 2,
			...commonMajoritiesProps
		},
		resolutionPreview: {
			x: 0,
			y: 2,
			w: 8,
			h: 11,
			...commonResolutionPreviewProps
		},
		speakersList: {
			x: 8,
			y: 2,
			w: 4,
			h: 5,
			...commonSpeakersListProps
		},
		commentsList: {
			x: 8,
			y: 7,
			w: 4,
			h: 6,
			...commonCommentsListProps
		}
	},
	default: {
		committeeTitle: {
			x: 0,
			y: 0,
			w: 4,
			h: 2,
			...commonCommitteeTitleProps
		},
		committeeStatus: {
			x: 8,
			y: 0,
			w: 4,
			h: 2,
			...commonCommitteeStatusProps
		},
		agendaItem: {
			x: 4,
			y: 0,
			w: 4,
			h: 2,
			...commonCommitteeAgendaItemProps
		},
		majorities: {
			x: 0,
			y: 2,
			w: 4,
			h: 2,
			...commonMajoritiesProps
		},
		whiteboard: {
			x: 0,
			y: 4,
			w: 4,
			h: 9,
			...commonWhiteboardProps
		},
		speakersList: {
			x: 4,
			y: 2,
			w: 4,
			h: 11,
			...commonSpeakersListProps
		},
		commentsList: {
			x: 8,
			y: 2,
			w: 4,
			h: 11,
			...commonCommentsListProps
		}
	},
	smallScreen: {
		committeeStatus: {
			x: 0,
			y: 0,
			w: 6,
			h: 2,
			...commonCommitteeStatusProps
		},
		majorities: {
			x: 6,
			y: 0,
			w: 6,
			h: 2,
			...commonMajoritiesProps
		},
		whiteboard: {
			x: 6,
			y: 8,
			w: 6,
			h: 5,
			...commonWhiteboardProps
		},
		speakersList: {
			x: 0,
			y: 2,
			w: 6,
			h: 11,
			...commonSpeakersListProps
		},
		commentsList: {
			x: 6,
			y: 2,
			w: 6,
			h: 6,
			...commonCommentsListProps
		}
	}
};

// While requests are pending, each preset makes room for a requests tile by
// shrinking whatever is least time-critical in that preset: the whiteboard in
// the default layout, the comment list in the others.
const requestsLayoutOverrides: Record<PresentationLayoutPresetOptions, PresentationLayoutPresets> =
	{
		resolution: {
			speakersList: { x: 8, y: 2, w: 4, h: 4, ...commonSpeakersListProps },
			commentsList: { x: 8, y: 6, w: 4, h: 4, ...commonCommentsListProps },
			requests: { x: 8, y: 10, w: 4, h: 3, ...commonRequestsProps }
		},
		default: {
			whiteboard: { x: 0, y: 4, w: 4, h: 4, ...commonWhiteboardProps },
			requests: { x: 0, y: 8, w: 4, h: 5, ...commonRequestsProps }
		},
		smallScreen: {
			commentsList: { x: 6, y: 2, w: 6, h: 4, ...commonCommentsListProps },
			requests: { x: 6, y: 6, w: 6, h: 3, ...commonRequestsProps },
			whiteboard: { x: 6, y: 9, w: 6, h: 4, ...commonWhiteboardProps }
		}
	};

export const getPresentationLayoutPreset = (
	preset: PresentationLayoutPresetOptions = 'default',
	{ showRequests = false }: { showRequests?: boolean } = {}
): PresentationLayoutPresets => {
	const key = preset in presentationLayoutPresets ? preset : 'default';
	const base = presentationLayoutPresets[key];
	if (!showRequests) return base;
	return { ...base, ...requestsLayoutOverrides[key] };
};

export const getPresentationLayoutPresets = () => {
	return (Object.keys(presentationLayoutPresets) as PresentationLayoutPresetOptions[]).filter(
		(k) => k !== 'resolution'
	);
};
