import type { PresentationLayoutPresetOptions } from '$lib/data/presentationLayoutPresets';
import Dexie, { type EntityTable } from 'dexie';

interface PresentationLayout {
	committeeId: string;
	layout: PresentationLayoutPresetOptions;
}

const localDB = new Dexie('local-db') as Dexie & {
	presentationLayout: EntityTable<PresentationLayout, 'committeeId'>;
};

localDB.version(1).stores({
	presentation: '++committeeId, layout'
});

export type { PresentationLayout };
export { localDB };
