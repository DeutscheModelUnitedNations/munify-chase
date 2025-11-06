import type { ComponentProps } from "svelte";
import type { GridItem } from "svelte-grid-extended";

type PresentationLayoutPresets = {
  committeeTitle?: ComponentProps<GridItem>;
  committeeStatus?: ComponentProps<GridItem>;
  agendaItem?: ComponentProps<GridItem>;
  majorities?: ComponentProps<GridItem>;
  whiteboard?: ComponentProps<GridItem>;
  speakersList?: ComponentProps<GridItem>;
  commentsList?: ComponentProps<GridItem>;
};

const commonCommitteeTitleProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 1,
    h: 2,
  },
};

const commonCommitteeStatusProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 3,
    h: 2,
  },
};

const commonCommitteeAgendaItemProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 2,
    h: 2,
  },
};

const commonMajoritiesProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 4,
    h: 2,
  },
};

const commonWhiteboardProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 4,
    h: 4,
  },
};

const commonSpeakersListProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 4,
    h: 4,
  },
};

const commonCommentsListProps: Partial<ComponentProps<GridItem>> = {
  min: {
    w: 4,
    h: 4,
  },
};

export type PresentationLayoutPresetOptions = "default" | "smallScreen";

const presentationLayoutPresets: Record<
  PresentationLayoutPresetOptions,
  PresentationLayoutPresets
> = {
  default: {
    committeeTitle: {
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      ...commonCommitteeTitleProps,
    },
    committeeStatus: {
      x: 8,
      y: 0,
      w: 4,
      h: 2,
      ...commonCommitteeStatusProps,
    },
    agendaItem: {
      x: 4,
      y: 0,
      w: 4,
      h: 2,
      ...commonCommitteeAgendaItemProps,
    },
    majorities: {
      x: 0,
      y: 2,
      w: 4,
      h: 2,
      ...commonMajoritiesProps,
    },
    whiteboard: {
      x: 0,
      y: 4,
      w: 4,
      h: 9,
      ...commonWhiteboardProps,
    },
    speakersList: {
      x: 4,
      y: 2,
      w: 4,
      h: 11,
      ...commonSpeakersListProps,
    },
    commentsList: {
      x: 8,
      y: 2,
      w: 4,
      h: 11,
      ...commonCommentsListProps,
    },
  },
  smallScreen: {
    committeeStatus: {
      x: 0,
      y: 0,
      w: 6,
      h: 2,
      ...commonCommitteeStatusProps,
    },
    majorities: {
      x: 6,
      y: 0,
      w: 6,
      h: 2,
      ...commonMajoritiesProps,
    },
    whiteboard: {
      x: 6,
      y: 8,
      w: 6,
      h: 5,
      ...commonWhiteboardProps,
    },
    speakersList: {
      x: 0,
      y: 2,
      w: 6,
      h: 11,
      ...commonSpeakersListProps,
    },
    commentsList: {
      x: 6,
      y: 2,
      w: 6,
      h: 6,
      ...commonCommentsListProps,
    },
  },
};

export const getPresentationLayoutPreset = (
  preset: PresentationLayoutPresetOptions = "default",
): PresentationLayoutPresets => {
  return presentationLayoutPresets[preset];
};

export const getPresentationLayoutPresets = () => {
  return Object.keys(presentationLayoutPresets);
};
