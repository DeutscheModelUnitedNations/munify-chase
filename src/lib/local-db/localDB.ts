import type { PresentationLayoutPresetOptions } from '$lib/data/presentationLayoutPresets';
import Dexie, { type EntityTable } from 'dexie';

interface CommitteeSettings {
	committeeId: string;
	layout: PresentationLayoutPresetOptions;
	presentationRootFontSize: number;
	presentationResolutionFontSize: number;
	displayRegionalGroups: boolean;
	rollCall: number | null;
	/**
	 * Committee member IDs whose roll-call presence change is currently being
	 * saved (mutation in flight, not yet confirmed by the server). Shared across
	 * tabs so the presentation view can show a spinner instead of a misleading
	 * absent/present icon while a delegation is still syncing. Not indexed, so no
	 * Dexie schema/version change is required.
	 */
	rollCallPending: string[] | null;
}

const localDB = new Dexie('local-db') as Dexie & {
	committeeSettings: EntityTable<CommitteeSettings, 'committeeId'>;
};

localDB.version(1).stores({
	committeeSettings: `
	++committeeId,
	layout,
	presentationRootFontSize,
	presentationResolutionFontSize,
	displayRegionalGroups,
	rollCall
	`
});

export type { CommitteeSettings };
export { localDB };
