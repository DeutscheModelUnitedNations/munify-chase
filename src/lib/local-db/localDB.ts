import type { PresentationLayoutPresetOptions } from '$lib/data/presentationLayoutPresets';
import Dexie, { type EntityTable } from 'dexie';

interface CommitteeSettings {
	committeeId: string;
	layout: PresentationLayoutPresetOptions;
}

const localDB = new Dexie('local-db') as Dexie & {
	committeeSettings: EntityTable<CommitteeSettings, 'committeeId'>;
};

localDB.version(1).stores({
	committeeSettings: '++committeeId, layout'
});

export type { CommitteeSettings };
export { localDB };
